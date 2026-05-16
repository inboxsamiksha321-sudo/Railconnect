import tweepy
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get Bearer Token
BEARER_TOKEN = os.getenv("BEARER_TOKEN")

# Twitter Client
client = tweepy.Client(bearer_token=BEARER_TOKEN)


QUERY = """
(
(
(train OR railway OR irctc OR railmadad)
(delay OR late OR dirty OR refund OR cancelled OR issue OR complaint)
)
OR
@RailconnectH14
OR
@RailMinIndia
OR
@IRCTCofficial
OR
@RailMadad
)
-is:retweet lang:en
"""
# Store latest fetched tweet ID
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

            # Save newest tweet ID
            last_seen_id = response.data[0].id

        return tweets

    except Exception as e:

        print("\nERROR FETCHING TWEETS:")
        print(e)

        return []