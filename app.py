# app.py
from flask import Flask, send_file
from flask_jwt import JWT, jwt_required

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret'

jwt = JWT(app)

class User(object):
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

@jwt.authentication_handler
def authenticate(username, password):
    if username == 'test' and password == 'test':
        return User(id=1, username='test')

@jwt.user_handler
def load_user(payload):
    if payload['user_id'] == 1:
        return User(id=1, username='test')

@app.route('/protected')
@jwt_required()
def protected():
    return 'Success!'

@app.route('/')
def index():
    return send_file('index.html')

if __name__ == '__main__':
    app.run()
