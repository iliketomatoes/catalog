from flask import Blueprint
from flask import request
from flask import jsonify
from database import db_session
from models import Region, Recipe

regions = Blueprint('regions', __name__)


# Get regions
@regions.route('/regions', methods=['GET'])
def showRegions():
    region_id = request.args.get('region_id')
    if (region_id == '' or region_id is None):
        region_list = db_session.query(Region).all()
    else:
        region_list = db_session.\
            query(Region).filter_by(id=region_id).all()

    return jsonify(collection=[i.serialize for i in region_list])
