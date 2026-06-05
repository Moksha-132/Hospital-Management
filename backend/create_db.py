import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    conn = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="1234",
        host="localhost",
        port="5432"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'hospital_management'")
    exists = cursor.fetchone()
    
    if not exists:
        print("Database 'hospital_management' does not exist. Creating...")
        cursor.execute('CREATE DATABASE hospital_management')
        print("Successfully created 'hospital_management' database.")
    else:
        print("Database 'hospital_management' already exists.")
        
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
