from app.db.sql_executor import execute_query
from flask import jsonify
from loguru import logger
from datetime import datetime, timezone
import humanize


class ProfileViewsService():

    def log_profile_view(self, viewer_id, profile_owner_id):
        try:
            if viewer_id == profile_owner_id:
                return jsonify({
                    "status": "error",
                    "message": "You cannot log a view for your own profile."
                }), 400
            insert_query = "INSERT INTO profile_views (viewer_id, profile_owner_id) VALUES (%s, %s)"
            execute_query(insert_query, params=(viewer_id, profile_owner_id))
            return jsonify({"status": "success", "message": "Profile view logged successfully"}), 200
        except Exception as e:
            logger.error(f"Error logging profile view: {e}")
            return jsonify({'status': 'error', 'message': 'Error logging profile view'}), 500



    def get_profile_views(self, profile_owner_id):
        try:
            select_query = "SELECT * FROM profile_views WHERE profile_owner_id = %s ORDER BY viewed_at DESC"
            viewers = execute_query(select_query, params=(profile_owner_id,), fetch_all=True)
            return jsonify(viewers), 200
        except Exception as e:
            logger.error(f"Error fetching viewers of profle owner: {e}")


    def get_viewed_profiles(self, viewer_id):
        try:
            select_query = "SELECT * FROM profile_views WHERE viewer_id = %s ORDER BY viewed_at DESC"
            viewers = execute_query(select_query, params=(viewer_id,), fetch_all=True)

            formatted_history = []
            for history in viewers:
                select_query = "SELECT * FROM users WHERE ID = %s"
                user = execute_query(select_query, params=(history.get('profile_owner_id'),), fetch_one=True)
                history_time = history.get('viewed_at')
                if history_time.tzinfo is None:
                    history_time = history_time.replace(tzinfo=timezone.utc)
                formatted_history.append({
                    'username': user.get('username'),
                    'userPicture': user.get('picture_name'),
                    'time': humanize.naturaltime(
                        datetime.now(timezone.utc) - history_time
                    ),
                })

            return jsonify({'status': 'success', 'data': formatted_history}), 200
        except Exception as e:
            logger.error(f"Error fetching viewed profiles by viewer_id: {e}")