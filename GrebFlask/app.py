import os

from dotenv import load_dotenv
from flask import Flask, render_template, url_for, session, redirect
from authlib.integrations.flask_client import OAuth
from bson.json_util import dumps

from database import DB
from pools import PoolsBlueprint
from picks import PicksBlueprint

app = Flask(__name__)
app.secret_key = os.urandom(12)

# Register different controllers
app.register_blueprint(PoolsBlueprint)
app.register_blueprint(PicksBlueprint)

oauth = OAuth(app)

# Auth Routes
@app.route('/')
def index():
    #TODO: Add check if session already has the email stored
    return render_template('login.html')

@app.route('/auth/google')
def GoogleOAuth():
    CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
    oauth.register(
        name='google',
        client_id=os.environ.get('GOOGLE_CLIENT_ID'),
        client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
        server_metadata_url=CONF_URL,
        client_kwargs={
            'scope': 'openid email profile',
            'prompt': 'select_account'
        }
    )

    redirectUrl = url_for('GoogleOAuthCallback', _external = True);
    print(redirectUrl)
    return oauth.google.authorize_redirect(redirectUrl)

@app.route('/auth/google/callback')
def GoogleOAuthCallback():
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token, nonce=None)

    loggeduser = DB.users.find({ 'email': user['email'] })[0]
    session['pooler'] = dumps(DB.poolers.find({ 'user_id': loggeduser['_id'] })[0])
    return redirect('/pools', 302)

@app.route('/auth/goodbye')
def goodbye():
    session.clear()
    return redirect('/', 302)

if __name__ == "__main__":
    load_dotenv()
    port = int(os.environ.get('PORT', 5000))

    app.run(debug=True, host='0.0.0.0', port=port)
