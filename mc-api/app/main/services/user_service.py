import psycopg2.extras
from app.db import PostgresDBConnection
from app.main.utils.exceptions import UniqueConstraintError
from loguru import logger
from app.db import execute_query
from flask import jsonify


def fetch_user(id):
    try:
        select_query = "SELECT * FROM users WHERE id = %s"
        users = execute_query(select_query, params=(id,) ,fetch_one=True)
        return jsonify(users), 200
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return jsonify({'status': 'error', 'message': 'Error registering user'}), 500


def fetch_users():
    try:
        select_query = "SELECT * FROM users"
        users = execute_query(select_query,fetch_all=True)
        return jsonify(users), 200
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return jsonify({'status': 'error', 'message': 'Error fetching users'}), 500


def create_user(data):
    try:
        data["password_hash"] = 'nvkjnbkvnb'
        insert_query = f"INSERT INTO users ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
        new_user = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
        return jsonify(new_user), 201
    except UniqueConstraintError as e:
        logger.error(f"Error creating user: {e}")
        return jsonify({
            "status": "error",
            "error": {
                "message": f"{e.field} already exists",
                "code": e.code,
            }
        }), 409
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return jsonify({'status': 'error', 'message': 'Error creating user'}), 500


def update_user(id, data):
    try:
        update_query = f"""
        UPDATE users
        SET
            {', '.join([ f'{column} = %s' for column in data.keys()])}
        WHERE id = %s
        RETURNING *
        """
        logger.info(update_query)
        updated_user = execute_query(update_query, params=(*data.values(), id), fetch_one=True)
        return jsonify(updated_user), 200
    except UniqueConstraintError as e:
        logger.error(f"Error updating user: {e}")
        return jsonify({
            "status": "error",
            "error": {
                "message": f"{e.field} already exists",
                "code": e.code,
            }
        }), 409
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        return jsonify({'status': 'error', 'message': 'Error updating user'}), 500


def remove_user(id):
    try:
        delete_query = f"""
        DELETE FROM users
        WHERE id = %s
        RETURNING *
        """
        logger.info(delete_query)
        removed_user = execute_query(delete_query, params=(id,), fetch_one=True)
        return jsonify(removed_user), 200
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        return jsonify({'status': 'error', 'message': 'Error deleting user'}), 500
