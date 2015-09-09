from json import dumps
from flask import Blueprint
from flask import Response
from flask import request
from flask import jsonify
from jinja2 import Markup
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Region, Recipe

recipes = Blueprint('recipes', __name__)

engine = create_engine('sqlite:///italianrecipes.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

def sanitize(unsafe_form_field):
    str_to_sanitize = str(unsafe_form_field)
    return Markup(str_to_sanitize).striptags()

@recipes.route('/recipes', methods=['GET'])
def showAll():
    recipes_list = session.query(Recipe).all()
    js = dumps([i.serialize for i in recipes_list])
    return Response(js, status=200, mimetype='application/json')


@recipes.route('/recipes/<recipe_id>', methods=['GET'])
def showOne(recipe_id):
    recipes_list = session.query(Recipe).filter(Recipe.id==recipe_id).all()
    js = dumps([i.serialize for i in recipes_list])
    return Response(js, status=200, mimetype='application/json')


@recipes.route('/recipes', methods=['POST'])
def addOne():
    data_request = request.get_json()
    newRecipe = Recipe(
        name=sanitize(data_request['name']),
        description=sanitize(data_request['description']),
        duration=sanitize(data_request['duration']),
        difficulty=sanitize(data_request['difficulty']),
        region_id=sanitize(data_request['region_id']))
    session.add(newRecipe)
    session.commit()
    return jsonify(success='true')


# Get regions
@recipes.route('/regions', methods=['GET'])
def showRegions():
    region_list = session.query(Region).all()
    js = dumps([i.serialize for i in region_list])
    resp = Response(js, status=200, mimetype='application/json')
    return resp
