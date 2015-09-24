from flask import render_template
from flask import session as login_session
import random
import string
from flask import Blueprint
from flask import request
from flask import jsonify
from database import db_session
from sqlalchemy import func

from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
# import httplib2
import json
from flask import make_response
# import requests

auth = Blueprint('auth', __name__)

CLIENT_ID = json.loads(
    open('client_secrets.json', 'r').read())['web']['client_id']
APPLICATION_NAME = "Udacity Catalog - Italian Recipes"


@auth.route('/auth/login', methods=['GET'])
def showLoginPage():
    state = ''.join(random.choice(string.ascii_lowercase + string.digits)
                    for x in xrange(32))
    login_session['state'] = state
    return render_template('auth.html', state=login_session['state'])


@auth.route('/auth/gconnect', methods=['POST'])
def login():
    if request.headers.get('italian-recipes-token') != login_session['state']:
        resp = jsonify(error=['You are not allowed to make such request.'])
        resp.status_code = 401
        return resp

    # Obtain authorization code
    code = request.form['id_token']

    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)

    except FlowExchangeError, e:
        resp = jsonify(error=[e.message])
        resp.status_code = 401
        return resp

    return jsonify(credentials=credentials)


@auth.route('/auth/oauth2callback')
def loginCallback():
    return 'login loginCallback'
