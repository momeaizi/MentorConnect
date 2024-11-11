import psycopg2.extras
from app.db import PostgresDBConnection
from loguru import logger
from app.db import execute_query


def fetch_user(id):
    select_query = "SELECT * FROM users WHERE id = %s"
    users = execute_query(select_query, params=(id,) ,fetch_one=True)
    return users

def fetch_users():
    select_query = "SELECT * FROM users"
    users = execute_query(select_query,fetch_all=True)
    return users

def create_user(data):
    data["password_hash"] = 'nvkjnbkvnb'
    insert_query = f"INSERT INTO users ({', '.join(data.keys())}) VALUES (%s, %s, %s) RETURNING *"
    new_user = execute_query(insert_query, params=tuple(data.values()), fetch_one=True)
    return new_user


def update_user(id, data):
    update_query = f"""
    UPDATE users
    SET
        {', '.join([ f'{column} = %s' for column in data.keys()])}
    WHERE id = %s
    RETURNING *
    """
    logger.info(update_query)
    updated_user = execute_query(update_query, params=(*data.values(), id), fetch_one=True)
    return updated_user

def remove_user(id):
    delete_query = f"""
    DELETE FROM users
    WHERE id = %s
    RETURNING *
    """
    logger.info(delete_query)
    removed_user = execute_query(delete_query, params=(id,), fetch_one=True)
    return removed_user
