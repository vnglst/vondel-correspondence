import os
import psycopg2


class Database:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
        )
        self.cur = self.conn.cursor()

    def execute(self, query, params=None):
        try:
            self.cur.execute(query, params)
            self.conn.commit()
        except psycopg2.DatabaseError as e:
            print(f"Database error: {e}")
            self.close()

    def fetchone(self):
        try:
            return self.cur.fetchone()
        except psycopg2.DatabaseError as e:
            print(f"Database error: {e}")
            self.close()

    def fetchall(self):
        try:
            return self.cur.fetchall()
        except psycopg2.DatabaseError as e:
            print(f"Database error: {e}")
            self.close()

    def close(self):
        self.cur.close()
        self.conn.close()
