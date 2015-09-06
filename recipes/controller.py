from flask import Blueprint
from flask import jsonify

recipes = Blueprint('recipes', __name__, url_prefix='/recipes')


@recipes.route('/', methods=['GET'])
def showAll():
    return jsonify(data='none', page='controller_recipes')

@recipes.route('/<recipe_id>/', methods=['GET'])
def showOne(recipe_id):
    return jsonify(data='none', page='controller_recipes/recipe_id')    
