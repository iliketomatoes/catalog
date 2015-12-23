import os
import dicttoxml
from flask import Blueprint
from flask import request
from flask import jsonify
from flask import session as login_session
from jinja2 import Markup
from werkzeug import secure_filename
from catalog.database import db_session
from catalog.models import Region, Recipe, User
from sqlalchemy.sql import func
from catalog.settings import UPLOAD_FOLDER

recipes = Blueprint('recipes', __name__)

# Variables for managing picture upload
# UPLOAD_FOLDER = os.path.join(APP_STATIC, 'uploads')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])


class InputDataHolder:

    """Helper class to store input fields data and their errors"""

    def __init__(self, errors, inputs):
        self.errors = errors
        self.inputs = inputs


def sanitize(key, value):
    """Helper function to sanitize data sent over the form.
    Returns a dictionary"""
    str_to_sanitize = value
    return {key: Markup(str_to_sanitize).striptags()}


def checkRecipeForm(data_request):
    """Helper function to check if required fields in the form were filled.
    Returns a InputDataHolder instance"""
    errors = []
    sanitized_inputs = {}
    for key, value in data_request.iteritems():
        tmp = sanitize(key, value)
        if (tmp[key] == '' or tmp[key] == None):
            if(key == 'image_url'):
                pass
            else:
                errors.append(key)
        else:
            sanitized_inputs.update(tmp)
    return InputDataHolder(errors, sanitized_inputs)


def removeImage(image_url):
    """Remove image after recipe has been deleted"""
    file_to_remove = os.path.join(UPLOAD_FOLDER, image_url)
    if(os.path.isfile(file_to_remove)):
        print 'File to remove', file_to_remove
        os.remove(file_to_remove)


@recipes.route('/recipes', methods=['GET'])
def showAll():
    """RESTful method for reading recipes"""
    region_id = request.args.get('region_id')
    user_id = request.args.get('user_id')
    xml_format = request.args.get('xml')

    # Check if query parameters were added to the request
    if (region_id != '' and region_id is not None):
        # Get recipes from one region
        recipes_list = db_session.\
            query(Recipe).filter_by(region_id=region_id).order_by(
                Recipe.last_update.desc()).all()
    elif (user_id != '' and user_id is not None):
        # Get recipes from one user
        recipes_list = db_session.\
            query(Recipe).filter_by(user_id=user_id).order_by(
                Recipe.last_update.desc()).all()
    else:
        # Get all recipes
        recipes_list = db_session.query(Recipe).order_by(
            Recipe.last_update.desc()).all()

    serialized_result = [i.serialize for i in recipes_list]
    # Lastly we decide which data format to send
    if (xml_format == 'true' or xml_format == 'TRUE'):
        xml_output = dicttoxml.dicttoxml(serialized_result)
        return xml_output, 200, {'Content-Type': 'text/xml; charset=utf-8'}
    else:
        return jsonify(collection=serialized_result)


@recipes.route('/recipes/<int:recipe_id>', methods=['GET'])
def showRecipe(recipe_id):
    """RESTful method for reading a single recipe"""
    xml_format = request.args.get('xml')
    recipes_list = db_session.query(Recipe).filter(
        Recipe.id == recipe_id).all()
    serialized_result = [i.serialize for i in recipes_list]

    # Lastly we decide which data format to send
    if (xml_format == 'true' or xml_format == 'TRUE'):
        xml_output = dicttoxml.dicttoxml(serialized_result)
        return xml_output, 200, {'Content-Type': 'text/xml; charset=utf-8'}
    else:
        return jsonify(collection=serialized_result)


@recipes.route('/recipes/<int:recipe_id>', methods=['DELETE'])
def deleteRecipe(recipe_id):
    """RESTful method for deleting a recipe"""
    # Check if the token is correct to prevent CSRF
    if request.headers.get('italian-recipes-token') != login_session['state']:
        resp = jsonify(error=['You are not allowed to make such request.'])
        resp.status_code = 401
        return resp

    # Check if user is logged in
    if 'username' not in login_session:
        resp = jsonify(error=['You are not allowed to do this'])
        resp.status_code = 401
        return resp

    recipe = db_session.query(Recipe).filter(
        Recipe.id == recipe_id).one()

    # Check if current user is the recipe's owner
    if recipe.user_id != login_session['user_id']:
        resp = jsonify(error=['You are not authorized to do this!'])
        resp.status_code = 403
        return resp

    # Delete the recipe's picture from the file system
    if(recipe.image_url is not None):
        removeImage(recipe.image_url)

    db_session.delete(recipe)
    db_session.commit()
    return jsonify(id=recipe.id)


@recipes.route('/recipes', methods=['POST'])
def addRecipe():
    """RESTful method for creating a recipe"""
    # Check if the token is correct to prevent CSRF
    if request.headers.get('italian-recipes-token') != login_session['state']:
        resp = jsonify(error=['You are not allowed to make such request.'])
        resp.status_code = 401
        return resp

    # Check if user is logged in
    if 'username' not in login_session:
        resp = jsonify(error=['You are not allowed to do this'])
        resp.status_code = 401
        return resp

    # Check if all require input fields were filled
    # Sanitize input data
    data = checkRecipeForm(request.get_json())
    # If no errors, we are good
    if (len(data.errors) == 0):
        newRecipe = Recipe(
            name=data.inputs['name'],
            description=data.inputs['description'],
            duration=data.inputs['duration'],
            difficulty=data.inputs['difficulty'],
            region_id=data.inputs['region_id'],
            user_id=login_session['user_id'])
        db_session.add(newRecipe)
        db_session.commit()
        return jsonify(id=newRecipe.id, name=newRecipe.name)
    else:
        resp = jsonify(error=data.errors)
        resp.status_code = 400
        return resp


@recipes.route('/recipes/<int:recipe_id>', methods=['PUT'])
def uppdateRecipe(recipe_id):
    """RESTful method for updating a recipe"""
    # Check if the token is correct to prevent CSRF
    if request.headers.get('italian-recipes-token') != login_session['state']:
        resp = jsonify(error=['You are not allowed to make such request.'])
        resp.status_code = 401
        return resp

    # Check if user is logged in
    if 'username' not in login_session:
        resp = jsonify(error=['You are not allowed to do this'])
        resp.status_code = 401
        return resp

    recipe = db_session.query(Recipe).filter_by(id=recipe_id).one()

    # Check if current user is the recipe's owner
    if recipe.user_id != login_session['user_id']:
        resp = jsonify(error=['You are not authorized to do this!'])
        resp.status_code = 403
        return resp

    # Check if all require input fields were filled
    # Sanitize input data
    data = checkRecipeForm(request.get_json())
    # If no errors, we are good
    if (len(data.errors) == 0):
        recipe.name = data.inputs['name']
        recipe.description = data.inputs['description']
        recipe.duration = data.inputs['duration']
        recipe.difficulty = data.inputs['difficulty']
        recipe.region_id = data.inputs['region_id']
        recipe.last_update = func.now()
        db_session.add(recipe)
        db_session.commit()
        return jsonify(collection=[recipe.serialize])
    else:
        resp = jsonify(error=data.errors)
        resp.status_code = 400
        return resp


def allowed_file(filename):
    """Check if what we are trying to upload is a valid file (picture)"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@recipes.route('/uploadpicture/<recipe_id>', methods=['POST'])
def upload_picture(recipe_id):
    """Upload and associate image with a recipe"""
    # Check if the token is correct to prevent CSRF
    if request.headers.get('italian-recipes-token') != login_session['state']:
        resp = jsonify(error=['You are not allowed to make such request.'])
        resp.status_code = 401
        return resp

    # Check if user is logged in
    if 'username' not in login_session:
        resp = jsonify(error=['You are not allowed to do this'])
        resp.status_code = 401
        return resp

    recipe = db_session.query(Recipe).filter_by(id=recipe_id).one()

    # Check if current user is the recipe's owner
    if recipe.user_id != login_session['user_id']:
        resp = jsonify(error=['You are not authorized to do this!'])
        resp.status_code = 403
        return resp

    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = str(recipe.id) + '-' + secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        # Let's remove the old image if any were assiociated to the recipe
        if(recipe.image_url is not None):
            removeImage(recipe.image_url)
        recipe.image_url = filename
        db_session.add(recipe)
        db_session.commit()
        return jsonify(collection=[recipe.serialize])
    else:
        errorMsg = """It \'s likely that 
        you sent an invalid format file. 
        Could not process your request."""
        resp = jsonify(error=[errorMsg])
        resp.status_code = 400
        return resp
