from flask import Blueprint
from flask import request
from flask import jsonify
from database import db_session
from models import Region, Recipe
from sqlalchemy import func

regions = Blueprint('regions', __name__)


# Get regions
@regions.route('/regions', methods=['GET'])
def showRegions():
    count = request.args.get('count')
    if (count=='true' or count=='TRUE'):
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

        return jsonify(collection=[i for i in regions])

    else:	
        region_list = db_session.query(Region).all()
        return jsonify(collection=[i.serialize for i in region_list])


@regions.route('/regions/<int:region_id>', methods=['GET'])
def showOne(region_id):
    region_list = db_session.query(Region).filter(
        Region.id == region_id).all()
    return jsonify(collection=[i.serialize for i in region_list])
