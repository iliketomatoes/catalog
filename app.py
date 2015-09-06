from flask import Flask, render_template
from recipes.controller import recipes

app = Flask(__name__)


@app.route('/')
def home():
    try:
        return render_template('index.html')
    except TemplateNotFound:
        abort(404)

app.register_blueprint(recipes)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
