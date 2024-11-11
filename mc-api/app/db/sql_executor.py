from app.db import PostgresDBConnection
import psycopg2.extras
from loguru import logger


def execute_query(query, params=None, fetch_one=False, fetch_all=False):

    postgres_db_connection = PostgresDBConnection()
    result = None

    try:
        with postgres_db_connection.get_db_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
                cursor.execute(query, params)
                if fetch_one:
                    result = dict(cursor.fetchone())
                elif fetch_all:
                    result = [dict(record) for record in cursor.fetchall()]
                else:
                    conn.commit()
                    result = {"count": cursor.rowcount}
    except Exception as e:
        logger.error(f"Error executing query: {e}")
    finally:
        postgres_db_connection.release_db_connection(conn)
    return result

