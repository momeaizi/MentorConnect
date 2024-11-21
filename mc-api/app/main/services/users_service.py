import psycopg2.extras
from app.main.utils.exceptions import UniqueConstraintError
from loguru import logger
from app.db.sql_executor import execute_query
from flask import jsonify
from datetime import datetime

class UserService:
    def fetch_user(self, id):
        try:
            select_query = "SELECT * FROM users WHERE id = %s"
            users = execute_query(select_query, params=(id,) ,fetch_one=True)
            return jsonify(users), 200
        except Exception as e:
            logger.error(f"Error fetching user: {e}")
            return jsonify({'status': 'error', 'message': 'Error fetching user'}), 500


    def fetch_users(self, ):
        try:
            select_query = """
                SELECT 
                    u.id AS user_id,
                    u.username,
                    u.email,
                    u.validate,
                    u.is_logged_in,
                    u.last_logged_in,
                    u.created_at,
                    u.updated_at,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT('id', t.id, 'name', t.name)
                        ) FILTER (WHERE t.id IS NOT NULL), 
                        '[]'
                    ) AS tags
                FROM 
                    users u
                LEFT JOIN 
                    user_tags ut ON u.id = ut.user_id
                LEFT JOIN 
                    tags t ON ut.tag_id = t.id
                GROUP BY 
                    u.id
            """
            users = execute_query(select_query,fetch_all=True)
            return jsonify(users), 200
        except Exception as e:
            logger.error(f"Error fetching users: {e}")
            return jsonify({'status': 'error', 'message': 'Error fetching users'}), 500


    def create_user(self, data):
        try:
            data["password_hash"] = 'nvkjnbkvnb'
            insert_query = f"INSERT INTO users ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
            new_user = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
            return jsonify(new_user), 201
        except UniqueConstraintError as e:
            logger.error(f"warning creating user: {e}")
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


    def update_user(self, id, data):
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
            logger.error(f"warning updating user: {e}")
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


    def remove_user(self, id):
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


    def set_user_logged_in(self, user_id):
        update_query = """
        UPDATE users
        SET
            is_logged_in = %s
        WHERE id = %s
        RETURNING *
        """
        execute_query(update_query, params=(True, user_id))


    def set_user_logged_out(self, user_id):
        current_utc_timestamp = datetime.utcnow()
        update_query = """
        UPDATE users
        SET
            is_logged_in = %s,
            last_logged_in = %s
        WHERE id = %s
        RETURNING *
        """
        execute_query(update_query, params=(False, current_utc_timestamp, user_id))