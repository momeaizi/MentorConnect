from app.db.sql_executor import execute_query
from flask import jsonify
from loguru import logger


class ProfileSuggestionsService():


    def get_suggestions(self, user_id):
        try:
            select_query = "SELECT * FROM users WHERE id = %s"
            current_user = execute_query(select_query, params=(user_id, ), fetch_one=True)
            select_query = """
            SELECT 
                u.id,
                u.username,
                u.email,
                u.first_name,
                u.last_name,
                u.gender,
                u.bio,
                u.birth_date,
                u.fame_rating,
                u.is_logged_in,
                ST_X(ST_AsText(geolocation)) AS longitude,
                ST_Y(ST_AsText(geolocation)) AS latitude,
                DATE_PART('year', AGE(u.birth_date)) AS age,
                ARRAY_AGG(t.interest) AS interests,
                'Marrakech' AS location,
                'https://thispersondoesnotexist.com/' AS image
            FROM 
                users u
            LEFT JOIN 
                user_interests ut ON u.id = ut.user_id
            LEFT JOIN 
                interests t ON ut.interest_id = t.id
            WHERE
                u.gender != %s AND
                NOT EXISTS (
                    SELECT 1
                    FROM blocked_users b
                    WHERE 
                        (b.blocker_id = %s AND b.blocked_id = u.id)
                        OR (b.blocker_id = u.id AND b.blocked_id = %s)
                )
            GROUP BY 
                u.id
            ORDER BY 
                u.id
            """
            users = execute_query(select_query, params=(current_user['gender'], current_user['id'], current_user['id']), fetch_all=True)
            return jsonify(users), 200
        except Exception as e:
            logger.error(f"Error fetching suggestions: {e}")
            return jsonify({'status': 'error', 'message': 'Error fetching suggestions'}), 500
    