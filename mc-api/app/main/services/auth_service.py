from app.main.utils.jwt import create_custom_access_token
from flask import current_app as app
from app.main.utils.exceptions import UniqueConstraintError
from app.main import bcrypt
from app.db import PostgresDBConnection
from app.db import execute_query
from loguru import logger
from flask import jsonify
import psycopg2.extras
import hmac
import hashlib

def register_user(data):
    try:
        insert_query = f"INSERT INTO users ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        new_user = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        #send email for validate
        return jsonify(new_user), 201
    except UniqueConstraintError as e:
        return jsonify({
            "status": "error",
            "message": f"{e.field} already exists",
        }), 409
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Error registring user'}), 500

def login_user(data):
    try:
        select_query = "SELECT * FROM users WHERE username = %s"
        user = execute_query(select_query, params=(data.get('username',None),) ,fetch_one=True)

        if user and bcrypt.check_password_hash( user.get('password_hash',None), data.get('password',None)):
            access_token = create_custom_access_token(identity={
                "id": user.get('id', None),
                "email": user.get('email', None),
                "username": user.get('username', None),
            })
            return jsonify(access_token=access_token), 200
        elif user and user.get('validated',None) == False:
            return jsonify({'status': 'error', 'message': 'Validate Your Account'}), 401
        elif user:
            return jsonify({'status': 'error', 'message': 'Incorrect Password'}), 401
        else:
            return jsonify({'status': 'error', 'message': f"user {data['username']} doesn't exist"}), 401
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
