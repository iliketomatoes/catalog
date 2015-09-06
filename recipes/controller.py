from flask import Blueprint
from flask import jsonify
from flask import request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Region, Recipe

recipes = Blueprint('recipes', __name__)

engine = create_engine('sqlite:///italianrecipes.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


@recipes.route('/recipes/', methods=['GET'])
def showAll():
    return jsonify(data='none', page='controller_recipes')


@recipes.route('/recipes/<recipe_id>/', methods=['GET'])
def showOne(recipe_id):
    return jsonify(data='none', page='controller_recipes/recipe_id')


# Get regions
@recipes.route('/regions', methods=['GET'])
def showRegions():
    region_list = session.query(Region).all()
    return jsonify(data=[i.serialize for i in region_list])
