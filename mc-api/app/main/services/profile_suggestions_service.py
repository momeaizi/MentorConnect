from app.db.sql_executor import execute_query
from flask import jsonify
from loguru import logger


class ProfileSuggestionsService():


    def get_suggestions(self, user_id):
        try:
            select_query = """
                WITH user_location AS (
                    SELECT 
                        geolocation 
                    FROM 
                        users 
                    WHERE 
                        id = %s
                ),
                common_tags AS (
                    SELECT 
                        u.id AS user_id,
                        COUNT(ui.interest_id) AS common_interests_count,
                        ARRAY_AGG(i.interest) AS common_interests_array
                    FROM 
                        users u
                    JOIN 
                        user_interests ui ON u.id = ui.user_id
                    JOIN 
                        interests i ON ui.interest_id = i.id
                    WHERE 
                        u.id != %s
                        AND ui.interest_id IN (
                            SELECT 
                                interest_id
                            FROM 
                                user_interests
                            WHERE 
                                user_id = %s
                        )
                    GROUP BY 
                        u.id
                )
                SELECT 
                    u.id,
                    u.username,
                    u.email,
                    u.first_name,
                    'https://thispersondoesnotexist.com/' AS image,
                    u.last_name,
                    u.gender,
                    u.bio,
                    u.birth_date,
                    u.fame_rating,
                    u.is_logged_in,
                    ST_X(ST_AsText(u.geolocation)) AS longitude,
                    ST_Y(ST_AsText(u.geolocation)) AS latitude,
                    DATE_PART('year', AGE(u.birth_date)) AS age,
                    ARRAY_AGG(t.interest) AS interests,
                    c.common_interests_count AS common_interests,
                    c.common_interests_array,
                    ST_Distance(u.geolocation, (SELECT geolocation FROM user_location)) / 1000 AS distance
                FROM 
                    users u
                LEFT JOIN 
                    user_interests ui ON u.id = ui.user_id
                LEFT JOIN 
                    interests t ON ui.interest_id = t.id
                LEFT JOIN 
                    common_tags c ON u.id = c.user_id
                WHERE 
                    u.id != %s
                    AND NOT EXISTS (
                        SELECT 1
                        FROM blocked_users b
                        WHERE 
                            (b.blocker_id = %s AND b.blocked_id = u.id)
                            OR (b.blocker_id = u.id AND b.blocked_id = %s)
                    )
                GROUP BY 
                    u.id, c.common_interests_count, c.common_interests_array
                ORDER BY 
                    c.common_interests_count DESC, -- Then by number of common interests
                    distance ASC, -- Prioritize by geographic proximity
                    u.fame_rating DESC; -- Finally by fame rating

            """
            users = execute_query(select_query, params=(user_id, user_id, user_id, user_id, user_id, user_id), fetch_all=True)
            return jsonify(users), 200
        except Exception as e:
            logger.error(f"Error fetching suggestions: {e}")
            return jsonify({'status': 'error', 'message': 'Error fetching suggestions'}), 500
    