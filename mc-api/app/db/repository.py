import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from loguru import logger


class Repository:
    def __init__(self, db_connection_pool):
        self.db_connection_pool = postgres_db_connection = PostgresDBConnection()

    def _execute_query(self, query, params=None, fetch_one=False, fetch_all=False):
        """
        Executes a SQL query and returns the result.
        
        :param query: SQL query to execute.
        :param params: Parameters for the query.
        :param fetch_one: Whether to fetch one record.
        :param fetch_all: Whether to fetch all records.
        :return: Query results.
        """
        connection = self.db_connection_pool.get_db_connection()
        if connection:
            try:
                with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                    cursor.execute(query, params)
                    if fetch_one:
                        return cursor.fetchone()
                    elif fetch_all:
                        return cursor.fetchall()
                    return None  # No result expected for non-select queries.
            except Exception as e:
                logger.error(f"Error executing query: {str(e)}")
            finally:
                self.db_connection_pool.release_db_connection(connection)
        return None

    def _execute_non_query(self, query, params=None):
        """
        Executes an SQL query without returning data (INSERT, UPDATE, DELETE).
        
        :param query: SQL query to execute.
        :param params: Parameters for the query.
        :return: Number of affected rows.
        """
        connection = self.db_connection_pool.get_db_connection()
        if connection:
            try:
                with connection.cursor() as cursor:
                    cursor.execute(query, params)
                    connection.commit()
                    return cursor.rowcount  # Number of rows affected
            except Exception as e:
                logger.error(f"Error executing non-query: {str(e)}")
            finally:
                self.db_connection_pool.release_db_connection(connection)
        return None

    def add(self, table, columns, values):
        """
        Inserts a new record into the specified table.
        
        :param table: Table name.
        :param columns: List of column names.
        :param values: List of values to insert into the columns.
        :return: The ID of the inserted record.
        """
        query = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(values))}) RETURNING id"
        result = self._execute_query(query, values, fetch_one=True)
        if result:
            return result['id']
        return None

    def update(self, table, updates, condition, params):
        """
        Updates a record in the specified table.
        
        :param table: Table name.
        :param updates: Dictionary of column-value pairs to update.
        :param condition: WHERE clause condition (e.g., "id = %s").
        :param params: Values for condition and updates.
        :return: Number of rows affected.
        """
        set_clause = ', '.join([f"{col} = %s" for col in updates.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"
        return self._execute_non_query(query, list(updates.values()) + params)

    def delete(self, table, condition, params):
        """
        Deletes a record from the specified table.
        
        :param table: Table name.
        :param condition: WHERE clause condition (e.g., "id = %s").
        :param params: Values for the condition.
        :return: Number of rows affected.
        """
        query = f"DELETE FROM {table} WHERE {condition}"
        return self._execute_non_query(query, params)

    def find_one(self, table, columns, condition, params):
        """
        Finds a single record based on condition.
        
        :param table: Table name.
        :param columns: Columns to select.
        :param condition: WHERE clause condition.
        :param params: Parameters for condition.
        :return: A dictionary of the record.
        """
        query = f"SELECT {', '.join(columns)} FROM {table} WHERE {condition}"
        return self._execute_query(query, params, fetch_one=True)

    def find_all(self, table, columns, condition=None, params=None):
        """
        Finds all records that match the condition.
        
        :param table: Table name.
        :param columns: Columns to select.
        :param condition: WHERE clause condition (optional).
        :param params: Parameters for the condition.
        :return: List of dictionaries of records.
        """
        query = f"SELECT {', '.join(columns)} FROM {table}"
        if condition:
            query += f" WHERE {condition}"
        return self._execute_query(query, params, fetch_all=True) or []

    def count(self, table, condition=None, params=None):
        """
        Counts the number of records in the table that match the condition.
        
        :param table: Table name.
        :param condition: WHERE clause condition (optional).
        :param params: Parameters for the condition.
        :return: Count of matching records.
        """
        query = f"SELECT COUNT(*) FROM {table}"
        if condition:
            query += f" WHERE {condition}"
        result = self._execute_query(query, params, fetch_one=True)
        return result['count'] if result else 0
