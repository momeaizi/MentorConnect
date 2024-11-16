from app.db import execute_query

def update_password(email, new_password):
    update_query = """UPDATE users SET password_hash = %s WHERE email = %s RETURNING *"""
    updated_user = execute_query(update_query, params=(new_password, email), fetch_one=True)
    return updated_user