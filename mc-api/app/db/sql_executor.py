from app.main import postgres_db_connection
from app.main.utils.exceptions import UniqueConstraintError
import psycopg2.extras
from loguru import logger


def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    result = None

    try:
        with postgres_db_connection.get_db_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
                cursor.execute(query, params)
                if fetch_one:
                    result = cursor.fetchone()
                    result = dict(result) if result else None
                elif fetch_all:
                    result = [dict(record) for record in cursor.fetchall()]
                else:
                    conn.commit()
                    result = {"count": cursor.rowcount}
    except psycopg2.IntegrityError as e:
        if 'unique constraint' in str(e).lower():
            field = 'unknown'
            if hasattr(e, 'diag') and e.diag.constraint_name:
                field = e.diag.constraint_name

            raise UniqueConstraintError(field=field)
        else:
            logger.error(f"Integrity error: {e}")
            return {'status': 'error', 'message': 'Database integrity error'}, 500
    finally:
        postgres_db_connection.release_db_connection(conn)
    return result

