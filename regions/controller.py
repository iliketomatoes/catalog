import dicttoxml
from flask import Blueprint
from flask import request
from flask import jsonify
from database import db_session
from models import Region, Recipe
from sqlalchemy import func
from inspect import getmembers
from pprint import pprint

regions = Blueprint('regions', __name__)


# Get regions
@regions.route('/regions', methods=['GET'])
def showRegions():
    count = request.args.get('count')
    catalog_mode = request.args.get('catalog')
    xml_format = request.args.get('xml')

    if (catalog_mode == 'true' or catalog_mode == 'TRUE'):
        region_list = db_session.query(Region).all()

        regions = []

        for i in region_list:
            recipes = []
            for recipe in i.region_recipes:
                recipes.append(recipe.serialize)
            region = i.serialize
            region['recipes'] = recipes
            regions.append(region)

        serialized_result = regions

    elif (count == 'true' or count == 'TRUE'):  # noqa
        # Get region_ids with amount of recpies for each region
        stmt = db_session.query(Recipe.region_id, func.count('*').
                                label('recipes_count')).\
            group_by(Recipe.region_id).subquery()

        region_list = db_session.query(Region, stmt.c.recipes_count).\
            outerjoin(stmt, Region.id == stmt.c.region_id).group_by(Region.id)

        regions = []

        for i, count in region_list:
            region = {'name': i.name, 'id': i.id, 'count': count}
            regions.append(region)

        serialized_result = regions

    else:
        region_list = db_session.query(Region).all()
        serialized_result = [i.serialize for i in region_list]

    # Lastly we decide which data format to send
    if (xml_format == 'true' or xml_format == 'TRUE'):
        xml_output = dicttoxml.dicttoxml(serialized_result)
        return xml_output, 200, {'Content-Type': 'text/xml; charset=utf-8'}
    else:
        return jsonify(collection=serialized_result)


@regions.route('/regions/<int:region_id>', methods=['GET'])
def showOne(region_id):
    catalog_mode = request.args.get('catalog')
    xml_format = request.args.get('xml')

    region_list = db_session.query(Region).filter(
        Region.id == region_id).all()

    if (catalog_mode == 'true' or catalog_mode == 'TRUE'):

        regions = []

        for i in region_list:
            recipes = []
            for recipe in i.region_recipes:
                recipes.append(recipe.serialize)
            region = i.serialize
            region['recipes'] = recipes
            regions.append(region)

        serialized_result = [regions]
    else:
        serialized_result = [i.serialize for i in region_list]

    # Lastly we decide which data format to send
    if (xml_format == 'true' or xml_format == 'TRUE'):
        xml_output = dicttoxml.dicttoxml(serialized_result)
        return xml_output, 200, {'Content-Type': 'text/xml; charset=utf-8'}
    else:
        return jsonify(collection=serialized_result)
