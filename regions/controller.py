from flask import Blueprint
from flask import request
from flask import jsonify
from database import db_session
from models import Region, Recipe

regions = Blueprint('regions', __name__)


# Get regions
@regions.route('/regions', methods=['GET'])
def showRegions():
    region_list = db_session.query(Region).all()
    return jsonify(collection=[i.serialize for i in region_list])
