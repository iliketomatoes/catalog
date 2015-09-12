from flask import Flask, render_template
from database import init_db
from recipes.controller import recipes
from regions.controller import regions

init_db()
app = Flask(__name__)


@app.route('/')
def home():
    try:
        return render_template('index.html')
    except TemplateNotFound:
        abort(404)

app.register_blueprint(recipes)
app.register_blueprint(regions)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
