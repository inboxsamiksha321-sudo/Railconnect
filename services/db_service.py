import psycopg2

conn = psycopg2.connect(
    host="aws-1-ap-south-1.pooler.supabase.com",
    database="postgres",
    user="postgres.kszitnjguqjumlwznnuu",
    password="edirailconnecth14",
    port="6543",
)

cursor = conn.cursor()


def get_train_id(train_no):                   # get train_id from train_no 
    cursor.execute(
        """
        SELECT train_id FROM trains WHERE train_no = %s
    """,
        (train_no,),
    )

    result = cursor.fetchone()
    return result[0] if result else None


def get_train_route(train_id):                # get train_route 
    cursor.execute(
        """
        SELECT tr.station_id, tr.stop_number, s.latitude, s.longitude
        FROM train_routes tr
        JOIN stations s ON tr.station_id = s.station_id
        WHERE tr.train_id = %s
        ORDER BY tr.stop_number
    """,
        (train_id,),
    )

    return cursor.fetchall()


