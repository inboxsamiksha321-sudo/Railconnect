import asyncio
from datetime import datetime
from services.twitter_collector import fetch_tweets
from services.ai_service import predict
from services.urgency_service import detect_priority
from services.db_service import (
    get_train_id,
    get_active_journey,
    get_train_route,
    get_officer_id,
    conn,
    cursor
)
from services.utility import extract_train_no

processed_tweet_ids = set()


async def twitter_worker():

    while True:

        try:

            print("\nChecking Twitter complaints...")

            tweets = fetch_tweets()

            print(f"Fetched {len(tweets)} tweets")

            for tweet in tweets:

                tweet_id = tweet["id"]
                text = tweet["text"]

                if tweet_id in processed_tweet_ids:
                    continue

                processed_tweet_ids.add(tweet_id)

                print("\nNEW TWEET:")
                print(text)

                # extract train number
                train_no = extract_train_no(text)

                if not train_no:

                    print("No train number found")
                    continue

                # AI department prediction
                departments = set()

                for d in predict(text):
                    departments.add(d)

                if not departments:
                    departments.add("General")

                # priority
                priority = detect_priority(departments)

                # train id
                train_id = get_train_id(train_no)

                if not train_id:

                    print("Invalid train number")
                    continue

                # active journey
                journey = get_active_journey(
                    train_id,
                    datetime.now()
                )

                if not journey:

                    print("Train not running")
                    continue

                route_id = journey["route_id"]

                route = get_train_route(route_id)

                if not route:

                    print("No route found")
                    continue

                # assign to last station for now
                last_station = route[-1]
                next_station_id = last_station[0]

                # insert complaint
                cursor.execute(
                    """
                    INSERT INTO complaints
                    (
                        train_id,
                        complaint_text,
                        assigned_station_id,
                        priority
                    )
                    VALUES (%s, %s, %s, %s)
                    RETURNING complaint_id
                    """,
                    (
                        train_id,
                        text,
                        next_station_id,
                        priority
                    )
                )

                complaint_id = cursor.fetchone()[0]

                # departments
                for dept in departments:

                    cursor.execute(
                        """
                        SELECT department_id
                        FROM departments
                        WHERE department_name = %s
                        """,
                        (dept,)
                    )

                    result = cursor.fetchone()

                    if not result:
                        continue

                    dept_id = result[0]

                    officer_id = get_officer_id(
                        next_station_id,
                        dept_id
                    )

                    cursor.execute(
                        """
                        INSERT INTO complaint_departments
                        (complaint_id, department_id)
                        VALUES (%s, %s)
                        """,
                        (
                            complaint_id,
                            dept_id
                        )
                    )

                    cursor.execute(
                        """
                        INSERT INTO complaint_assignments
                        (
                            complaint_id,
                            station_id,
                            department_id,
                            officer_id
                        )
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            complaint_id,
                            next_station_id,
                            dept_id,
                            officer_id
                        )
                    )

                conn.commit()

                print(
                    f"Twitter complaint stored: {complaint_id}"
                )

        except Exception as e:

            print("\nTWITTER WORKER ERROR:")
            print(e)

        await asyncio.sleep(10)