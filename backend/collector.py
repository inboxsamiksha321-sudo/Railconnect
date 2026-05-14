import tweepy
from dotenv import load_dotenv
import os

load_dotenv()

BEARER_TOKEN = os.getenv("BEARER_TOKEN")

client = tweepy.Client(bearer_token=BEARER_TOKEN)

QUERY = """
(train delay OR railway complaint OR late train
OR dirty coach OR ticket issue
OR @RailMinIndia OR @IRCTCofficial)
-is:retweet lang:en
"""

last_seen_id = None

def fetch_tweets():

    global last_seen_id

    response = client.search_recent_tweets(
        query=QUERY,
        max_results=10,
        since_id=last_seen_id
    )

    tweets = []

    if response.data:

        for tweet in response.data:

            tweets.append({
                "id": tweet.id,
                "text": tweet.text
            })

        last_seen_id = response.data[0].id

    return tweets