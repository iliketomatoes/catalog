from flask import Flask, render_template
from database import init_db
from recipes.controller import recipes
from regions.controller import regions
from auth.controller import auth

init_db()
app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

app.register_blueprint(recipes)
app.register_blueprint(regions)
app.register_blueprint(auth)

@app.route('/')
def home():
    try:
        return render_template('index.html')
    except TemplateNotFound:
        abort(404)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
