from fastapi import FastAPI
import asyncio
from datetime import datetime

from collector import fetch_tweets

from processor import (
    is_railway_related,
    is_complaint,
    extract_train,
    extract_station,
    classify
)

from database import (
    add_complaint,
    get_complaints
)

app = FastAPI()

processed_tweet_ids = set()


async def tweet_worker():

    while True:

        try:

            print("\nChecking for new railway complaints...")

            tweets = fetch_tweets()

            print(f"Fetched {len(tweets)} tweets")

            for tweet in tweets:

                tweet_id = tweet["id"]
                text = tweet["text"]

                if tweet_id in processed_tweet_ids:
                    continue

                processed_tweet_ids.add(tweet_id)

                is_direct_tag = "@railconnecth14" in text.lower()

                if not is_direct_tag:

                    if not is_railway_related(text):
                        continue

                    if not is_complaint(text):
                        continue

                data = {
                    "tweet_id": tweet_id,

                    "source": (
                        "direct_tag"
                        if is_direct_tag
                        else "public_monitoring"
                    ),

                    "tweet": text,

                    "tweet_created_at": tweet["created_at"],

                    "processed_at": str(datetime.now()),

                    "train": extract_train(text),

                    "station": extract_station(text),

                    "type": classify(text)
                }

                stored = add_complaint(data)

                if stored:

                    print("\nNEW RAILWAY COMPLAINT DETECTED")
                    print(data)

        except Exception as e:

            print("\nERROR IN TWEET WORKER:")
            print(e)

        await asyncio.sleep(120)


@app.on_event("startup")
async def startup():

    print("Starting Railway Complaint Collector Backend...")

    asyncio.create_task(tweet_worker())


@app.get("/")
def home():

    return {
        "message": "Railway Complaint Backend Running"
    }


@app.get("/complaints")
def complaints():

    return get_complaints()