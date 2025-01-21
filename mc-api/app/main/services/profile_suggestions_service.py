from app.db.sql_executor import execute_query
from flask import jsonify
from loguru import logger


class ProfileSuggestionsService():


    def get_suggestions(self, user_id):
        try:
            select_query = """
                WITH user_location AS (
                    SELECT 
                        *
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
                    p.file_name AS image,
                    u.last_name,
                    u.gender,
                    u.bio,
                    u.birth_date,
                    u.is_logged_in,
                    ST_X(ST_AsText(u.geolocation)) AS longitude,
                    ST_Y(ST_AsText(u.geolocation)) AS latitude,
                    DATE_PART('year', AGE(u.birth_date)) AS age,
                    ARRAY_AGG(t.interest) AS interests,
                    c.common_interests_count,
                    c.common_interests_array,
                    ST_Distance(u.geolocation, (SELECT geolocation FROM user_location)) / 1000 AS distance,
                    (
                        COALESCE((
                            SELECT COUNT(*)
                            FROM profile_views pv
                            WHERE pv.profile_owner_id = u.id
                        ), 0) + -- Views
                        COALESCE((
                            SELECT COUNT(*)
                            FROM profile_likes pl
                            WHERE pl.liked_profile_id = u.id
                        ), 0) + -- Likes
                        COALESCE((
                            SELECT COUNT(*)
                            FROM profile_likes pl1
                            JOIN profile_likes pl2
                            ON pl1.liker_id = pl2.liked_profile_id AND pl1.liked_profile_id = pl2.liker_id
                            WHERE pl1.liked_profile_id = u.id
                        ), 0) -- Matches
                    ) AS fame_rating,
                    CASE 
                        WHEN (
                            SELECT COUNT(*) 
                            FROM reported_users r 
                            WHERE r.reported_id = u.id
                        ) > 5 THEN TRUE
                        ELSE FALSE
                    END AS is_flagged,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = %s AND liked_profile_id = u.id
                        ) AND EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = u.id AND liked_profile_id = %s
                        ) THEN 'mutual'
                        WHEN EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = %s AND liked_profile_id = u.id
                        ) THEN 'one-way'
                        WHEN EXISTS (
                            SELECT 1 
                            FROM profile_likes 
                            WHERE liker_id = u.id AND liked_profile_id = %s
                        ) THEN 'liked-by'
                        ELSE 'none'
                    END AS like_status
                FROM 
                    users u
                LEFT JOIN 
                    user_interests ui ON u.id = ui.user_id
                LEFT JOIN 
                    interests t ON ui.interest_id = t.id
                LEFT JOIN 
                    common_tags c ON u.id = c.user_id
                LEFT JOIN
                    pictures p ON p.user_id = u.id AND p.is_profile = TRUE
                WHERE 
                    u.id != %s
                    AND u.is_complete = TRUE
                    AND u.gender != (SELECT gender FROM user_location)
                    AND NOT EXISTS (
                        SELECT 1
                        FROM blocked_users b
                        WHERE 
                            (b.blocker_id = %s AND b.blocked_id = u.id)
                            OR (b.blocker_id = u.id AND b.blocked_id = %s)
                    )
                    AND NOT EXISTS (
                        SELECT 1
                        FROM profile_likes l
                        WHERE 
                            l.liker_id = %s
                            AND l.liked_profile_id = u.id
                    )
                GROUP BY 
                    u.id, c.common_interests_count, c.common_interests_array, p.file_name
                ORDER BY 
                    distance ASC, -- Prioritize by geographic proximity
                    c.common_interests_count DESC, -- Then by number of common interests
                    fame_rating DESC; -- Finally by fame rating

            """
            users = execute_query(select_query, params=(user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id), fetch_all=True)
            return jsonify(users), 200
        except Exception as e:
            logger.error(f"Error fetching suggestions: {e}")
            return jsonify({'status': 'error', 'message': 'Error fetching suggestions'}), 500
    