import os
from flask import Blueprint
from flask import request
from flask import jsonify
from jinja2 import Markup
from werkzeug import secure_filename
from database import db_session
from models import Region, Recipe

recipes = Blueprint('recipes', __name__)


class InputDataHolder:

    def __init__(self, errors, inputs):
        self.errors = errors
        self.inputs = inputs


def sanitize(key, value):
    str_to_sanitize = value
    return {key: Markup(str_to_sanitize).striptags()}


def checkRecipe(data_request):
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


@recipes.route('/recipes', methods=['GET'])
def showAll():
    region_id = request.args.get('region_id')
    if (region_id == '' or region_id is None):
        recipes_list = db_session.query(Recipe).all()
    else:
        recipes_list = db_session.\
            query(Recipe).filter_by(region_id=region_id).all()
    return jsonify(collection=[i.serialize for i in recipes_list])


@recipes.route('/recipes/<int:recipe_id>', methods=['GET'])
def showRecipe(recipe_id):
    recipes_list = db_session.query(Recipe).filter(
        Recipe.id == recipe_id).all()
    return jsonify(collection=[i.serialize for i in recipes_list])


@recipes.route('/recipes/<int:recipe_id>', methods=['DELETE'])
def deleteRecipe(recipe_id):
    recipes_list = db_session.query(Recipe).filter(
        Recipe.id == recipe_id).delete()
    return jsonify(id=recipe_id)


@recipes.route('/recipes', methods=['POST'])
def addRecipe():
    data = checkRecipe(request.get_json())
    if (len(data.errors) == 0):
        newRecipe = Recipe(
            name=data.inputs['name'],
            description=data.inputs['description'],
            duration=data.inputs['duration'],
            difficulty=data.inputs['difficulty'],
            region_id=data.inputs['region_id'])
        db_session.add(newRecipe)
        db_session.commit()
        return jsonify(id=newRecipe.id, name=newRecipe.name)
    else:
        resp = jsonify(error=data.errors)
        resp.status_code = 400
        return resp


@recipes.route('/recipes/<int:recipe_id>', methods=['PUT'])
def uppdateRecipe(recipe_id):
    data = checkRecipe(request.get_json())
    if (len(data.errors) == 0):
        recipe = db_session.query(Recipe).filter_by(id=recipe_id).one()
        recipe.name=data.inputs['name']
        recipe.description=data.inputs['description']
        recipe.duration=data.inputs['duration']
        recipe.difficulty=data.inputs['difficulty']
        recipe.region_id=data.inputs['region_id']
        db_session.add(recipe)
        db_session.commit()
        return jsonify(collection=[recipe.serialize])
    else:
        resp = jsonify(error=data.errors)
        resp.status_code = 400
        return resp

# Managing picture upload
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@recipes.route('/uploadpicture/<recipe_id>', methods=['POST'])
def upload_picture(recipe_id):
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            return jsonify(filename=filename)
