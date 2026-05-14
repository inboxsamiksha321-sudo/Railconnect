from fastapi import FastAPI
import asyncio

from collector import fetch_tweets
from processor import (
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

async def tweet_worker():

    while True:

        try:

            tweets = fetch_tweets()

            for tweet in tweets:

                text = tweet["text"]

                if not is_complaint(text):
                    continue

                data = {
                    "tweet": text,
                    "train": extract_train(text),
                    "station": extract_station(text),
                    "type": classify(text)
                }

                add_complaint(data)

                print("\nNEW COMPLAINT:")
                print(data)

        except Exception as e:
            print("ERROR:", e)

        await asyncio.sleep(120)


@app.on_event("startup")
async def startup():

    asyncio.create_task(tweet_worker())


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.get("/complaints")
def complaints():
    return get_complaints()