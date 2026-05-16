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

# Prevent duplicate tweet processing
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

                # Skip duplicate tweets
                if tweet_id in processed_tweet_ids:
                    continue

                processed_tweet_ids.add(tweet_id)

                # STEP 1: Railway relevance filter
                if not is_railway_related(text):
                    continue

                # STEP 2: Complaint filter
                if not is_complaint(text):
                    continue

                # STEP 3: Structured complaint creation
                data = {
                    "tweet_id": tweet_id,
                    "tweet": text,
                    "tweet_created_at": tweet["created_at"],
                    "processed_at": str(datetime.now()),
                    "train": extract_train(text),
                    "station": extract_station(text),
                    "type": classify(text)
                }

                stored = add_complaint(data)

                # Print only unique complaints
                if stored:

                    print("\nNEW RAILWAY COMPLAINT DETECTED")
                    print(data)

        except Exception as e:

            print("\nERROR IN TWEET WORKER:")
            print(e)

        # Wait 2 minutes before next fetch
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