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
                "error": "Unauthorized"
            }, 401
        try:
            data = jwt.decode(token, app.config['JWT_PUBLIC_KEY'], algorithms=app.config['JWT_ALGORITHM'])
            select_query = "SELECT * FROM users WHERE id = %s"
            current_user = execute_query(select_query, params=(data['id'],) ,fetch_one=True)

            if not current_user:
                return {
                "message": "Invalid Authentication token!",
                "error": "Unauthorized"
            }, 401
            if not current_user.get('is_verified', None):
                return {
                "message": "Account is not Verified!",
                "error": "Unverified"
            }, 401
        except Exception as e:
            logger.error(e)
            return {
                "message": "Something went wrong",
            }, 500

        kwargs['user'] = current_user
        return f(*args, **kwargs)

    return decorated