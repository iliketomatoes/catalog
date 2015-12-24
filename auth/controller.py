import random
import string
import httplib2
import json
import requests
from flask import render_template, redirect, url_for
from flask import session as login_session
from flask import Blueprint
from flask import request
from flask import jsonify
from catalog.database import db_session
from catalog.models import User
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from catalog.settings import APP_ROOT

# Define the Blueprint and its template folder location
auth = Blueprint('auth', __name__, template_folder='templates')

# Get client id for Google+ authentication
CLIENT_ID = json.loads(
    open(APP_ROOT + '/client_secrets.json', 'r').read())['web']['client_id']
APPLICATION_NAME = "Udacity Catalog - Italian Recipes"


def createUser(login_session):
    newUser = User(name=login_session['username'], email=login_session[
                   'email'], picture=login_session['picture'])
    db_session.add(newUser)
    db_session.commit()
    return newUser.id


def getUserInfo(user_id):
    user = db_session.query(User).filter_by(id=user_id).one()
    return user


def getUserID(email):
    try:
        user = db_session.query(User).filter_by(email=email).one()
        return user.id
    except:
        return None


def generateToken():
    state = ''.join(random.choice(string.ascii_lowercase + string.digits)
                    for x in xrange(32))
    return state


@auth.route('/')
def home():
    """Here we register the route for the homepage"""
    try:
        login_session['state'] = generateToken()
        return render_template(
            'index.html',
            session=login_session,
            state=login_session['state']
        )
    except TemplateNotFound:
        abort(404)


@auth.route('/auth/login', methods=['GET'])
def showLoginPage():
    if 'username' not in login_session:
        login_session['state'] = generateToken()
        return render_template('auth.html', state=login_session['state'])
    else:
        return redirect('/')


@auth.route('/auth/gconnect', methods=['POST'])
def gconnect():
    if request.headers.get('italian-recipes-token') != login_session['state']:
        resp = jsonify(error=['You are not allowed to make such request.'])
        resp.status_code = 401
        return resp

    # Obtain authorization code
    code = request.data

    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets(
            APP_ROOT + '/client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError, e:
        resp = jsonify(error=[e.message])
        resp.status_code = 401
        return resp

    # Check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        resp = jsonify(error=[result.get('error')])
        resp.status_code = 500
        return resp

     # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        resp = jsonify(error=["Token's user ID doesn't match given user ID."])
        resp.status_code = 401
        return resp

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        resp = jsonify(error=["Token's client ID does not match app's."])
        resp.status_code = 401
        return resp

    # Let's check if the user was already logged in
    stored_credentials = login_session.get('credentials')
    stored_gplus_id = login_session.get('gplus_id')
    if stored_credentials is not None and gplus_id == stored_gplus_id:
        resp = jsonify(success=['Current user is already connected.'])
        resp.status_code = 401
        return resp

    # Store the access token in the session for later use.
    login_session['credentials'] = credentials.access_token
    login_session['gplus_id'] = gplus_id

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    login_session['username'] = data['name']
    login_session['picture'] = data['picture']
    login_session['email'] = data['email']

    # ADD PROVIDER TO LOGIN SESSION
    login_session['provider'] = 'google'

    # see if user exists, if it doesn't make a new one
    user_id = getUserID(data["email"])
    if not user_id:
        user_id = createUser(login_session)
    login_session['user_id'] = user_id

    return jsonify(success=['Login Successful'], data=data)


@auth.route('/auth/fbconnect', methods=['POST'])
def fbconnect():
    if request.headers.get('italian-recipes-token') != login_session['state']:
        resp = jsonify(error=['You are not allowed to make such request.'])
        resp.status_code = 401
        return resp

    access_token = request.data
    print "access token received %s " % access_token

    app_id = json.loads(open(APP_ROOT + '/fb_client_secrets.json', 'r').read())[
        'web']['app_id']
    app_secret = json.loads(
        open(APP_ROOT + '/fb_client_secrets.json', 'r').read())['web']['app_secret']  # noqa
    url = 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=%s&client_secret=%s&fb_exchange_token=%s' % (  # noqa
        app_id, app_secret, access_token)
    h = httplib2.Http()
    result = h.request(url, 'GET')[1]

    # Use token to get user info from API
    userinfo_url = "https://graph.facebook.com/v2.4/me"
    # strip expire tag from access token
    token = result.split("&")[0]

    url = 'https://graph.facebook.com/v2.4/me?%s&fields=name,id,email' % token
    h = httplib2.Http()
    result = h.request(url, 'GET')[1]
    # print "url sent for API access:%s"% url
    # print "API JSON result: %s" % result
    data = json.loads(result)
    login_session['provider'] = 'facebook'
    login_session['username'] = data["name"]
    login_session['email'] = data["email"]
    login_session['facebook_id'] = data["id"]

    # The token must be stored in the login_session in order to properly
    # logout, let's strip out the information before the equals sign in our
    # token
    stored_token = token.split("=")[1]
    login_session['access_token'] = stored_token

    # Get user picture
    url = 'https://graph.facebook.com/v2.4/me/picture?%s&redirect=0&height=200&width=200' % token  # noqa
    h = httplib2.Http()
    result = h.request(url, 'GET')[1]
    data = json.loads(result)

    login_session['picture'] = data["data"]["url"]

    # see if user exists
    user_id = getUserID(login_session['email'])
    if not user_id:
        user_id = createUser(login_session)
    login_session['user_id'] = user_id

    return jsonify(success=['Login Successful'], data=data)


@auth.route('/auth/fbdisconnect')
def fbdisconnect():
    facebook_id = login_session['facebook_id']
    # The access token must me included to successfully logout
    access_token = login_session['access_token']
    url = 'https://graph.facebook.com/%s/permissions?access_token=%s' % (
        facebook_id, access_token)
    h = httplib2.Http()
    result = h.request(url, 'DELETE')[1]
    # return "you have been logged out"
    del login_session['facebook_id']


@auth.route('/clearSession')
def clearSession():
    login_session.clear()
    return redirect(url_for('.home'))


@auth.route('/auth/gdisconnect')
def gdisconnect():
    # Only disconnect a connected user.
    credentials = login_session.get('credentials')
    if credentials is None:
        return render_template(
            'errorpage.html',
            error='Current user not connected.',
            status=401
        )
    access_token = credentials
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % access_token
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]
    print result

    if result['status'] == '200':
        # Reset the user's session.
        del login_session['credentials']
        del login_session['gplus_id']

    else:
        # For whatever reason, the given token was invalid.
        return render_template(
            'errorpage.html',
            error='Failed to revoke token for given user.',
            status=400
        )


# Disconnect based on provider
@auth.route('/auth/disconnect')
def disconnect():
    if 'provider' in login_session:
        if login_session['provider'] == 'google':
            gdisconnect()
        if login_session['provider'] == 'facebook':
            fbdisconnect()
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        del login_session['user_id']
        del login_session['provider']
        return redirect(url_for('.home'))
    else:
        return render_template(
            'errorpage.html',
            error='You are not logged in.',
            status=401
        )
