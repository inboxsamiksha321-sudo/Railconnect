import psycopg2

conn = psycopg2.connect(
    host="aws-1-ap-south-1.pooler.supabase.com",
    database="postgres",
    user="postgres.kszitnjguqjumlwznnuu",
    password="edirailconnecth14",
    port="6543",
)

cursor = conn.cursor()
