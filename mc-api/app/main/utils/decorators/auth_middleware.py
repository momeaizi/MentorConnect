from flask import current_app as app
from app.db.sql_executor import execute_query
from flask import request, abort
from functools import wraps
from loguru import logger
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data = jwt.decode(token, app.config['JWT_PRIVATE_KEY'], algorithms=app.config['JWT_ALGORITHM'])
            select_query = "SELECT * FROM users WHERE id = %s"
            current_user = execute_query(select_query, params=(data['id'],) ,fetch_one=True)
            if current_user is None:
                return {
                "message": "Invalid Authentication token!",
                "data": None,
                "error": "Unauthorized"
            }, 401
            if not current_user.get('validate', None):
                return {
                "message": "Account is not Validated!",
                "data": None,
                "error": "Unvalidated"
            }, 401
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500

        kwargs['user'] = current_user
        return f(*args, **kwargs)

    return decorated