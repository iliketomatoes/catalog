from flask import Flask, render_template
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# from models import Base, Restaurant, MenuItem
from flask import jsonify
from recipes.controller import recipes

app = Flask(__name__)

# engine = create_engine('sqlite:///italianrecipes.db')
# Base.metadata.bind = engine

# DBSession = sessionmaker(bind=engine)
# session = DBSession()


@app.route('/')
def home():
    return jsonify(data='none', page='home')

app.register_blueprint(recipes, url_prefix='/recipes')    


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
