import os
from json import dumps
from flask import Blueprint
from flask import Response
from flask import request
from flask import jsonify
from jinja2 import Markup
from werkzeug import secure_filename
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Region, Recipe

recipes = Blueprint('recipes', __name__)

engine = create_engine('sqlite:///italianrecipes.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


class InputDataHolder:

    def __init__(self, errors, inputs):
        self.errors = errors
        self.inputs = inputs


def sanitize(key, value):
    str_to_sanitize = str(value)
    return {key: Markup(str_to_sanitize).striptags()}


def checkRecipe(data_request):
    errors = []
    sanitized_inputs = {}
    for key, value in data_request.iteritems():
        tmp = sanitize(key, value)
        if (tmp[key] == '' or tmp[key] == None):
            errors.append(key)
        else:
            sanitized_inputs.update(tmp)
    return InputDataHolder(errors, sanitized_inputs)  


@recipes.route('/recipes', methods=['GET'])
def showAll():
    recipes_list = session.query(Recipe).all()
    js = dumps([i.serialize for i in recipes_list])
    return Response(js, status=200, mimetype='application/json')


@recipes.route('/recipes/<recipe_id>', methods=['GET'])
def showOne(recipe_id):
    recipes_list = session.query(Recipe).filter(Recipe.id == recipe_id).all()
    js = dumps([i.serialize for i in recipes_list])
    return Response(js, status=200, mimetype='application/json')


@recipes.route('/recipes', methods=['POST'])
def addOne():
    data = checkRecipe(request.get_json())
    if (len(data.errors) == 0):
        newRecipe = Recipe(
            name=data.inputs['name'],
            description=data.inputs['description'],
            duration=data.inputs['duration'],
            difficulty=data.inputs['difficulty'],
            region_id=data.inputs['region_id'])
        session.add(newRecipe)
        session.commit()
        return jsonify(id=newRecipe.id, name=newRecipe.name)
    else:
        resp = jsonify(error=data.errors)
        resp.status_code = 400
        return resp


# Get regions
@recipes.route('/regions', methods=['GET'])
def showRegions():
    region_list = session.query(Region).all()
    js = dumps([i.serialize for i in region_list])
    resp = Response(js, status=200, mimetype='application/json')
    return resp

# Managing picture upload
UPLOAD_FOLDER = 'static/img'
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