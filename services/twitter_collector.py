import tweepy
from dotenv import load_dotenv
import os

load_dotenv()

BEARER_TOKEN = os.getenv("BEARER_TOKEN")

client = tweepy.Client(
    bearer_token=BEARER_TOKEN
)

QUERY = "@RailconnectH14 -is:retweet"

last_seen_id = None


def fetch_tweets():

    global last_seen_id

    try:

        response = client.search_recent_tweets(
            query=QUERY,
            max_results=10,
            since_id=last_seen_id,
            tweet_fields=["created_at"]
        )

        tweets = []

        if response.data:

            for tweet in response.data:

                tweets.append({
                    "id": tweet.id,
                    "text": tweet.text,
                    "created_at": str(tweet.created_at)
                })

            last_seen_id = response.data[0].id

        return tweets

    except Exception as e:

        print("\nTWITTER FETCH ERROR:")
        print(e)

        return []