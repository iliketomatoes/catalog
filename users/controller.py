import dicttoxml
from flask import session as login_session
from flask import Blueprint
from flask import request
from flask import jsonify
from database import db_session
from models import User


users = Blueprint('users', __name__)


# See all the users registered
@users.route('/users')
def showUsers():
    xml_format = request.args.get('xml')
    users = db_session.query(User).all()
    serialized_result = [i.serialize for i in users]

    # Lastly we decide which data format to send
    if (xml_format == 'true' or xml_format == 'TRUE'):
        xml_output = dicttoxml.dicttoxml(serialized_result)
        return xml_output, 200, {'Content-Type': 'text/xml; charset=utf-8'}
    else:
        return jsonify(collection=serialized_result)


@users.route('/users/<int:user_id>', methods=['GET'])
def showUser(user_id):
    xml_format = request.args.get('xml')
    users = db_session.query(User).filter(
        User.id == user_id).all()
    serialized_result = [i.serialize for i in users]

    # Lastly we decide which data format to send
    if (xml_format == 'true' or xml_format == 'TRUE'):
        xml_output = dicttoxml.dicttoxml(serialized_result)
        return xml_output, 200, {'Content-Type': 'text/xml; charset=utf-8'}
    else:
        return jsonify(collection=serialized_result)
