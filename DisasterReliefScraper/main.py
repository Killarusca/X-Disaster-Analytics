from twikit import Client, TooManyRequests
import asyncio
import time
from datetime import datetime
import csv
from configparser import ConfigParser
from random import randint
import json

MINIMUM_TWEETS = 10
MAXIMUM_TWEETS = 20

config = ConfigParser()
config.read('config.ini')
username = config['X']['username']
email = config['X']['email']
password = config['X']['password']

async def main():
    client = Client(language='en-US')
    client.load_cookies('cookies.json')

    tweet_count = 0
    query = 'GMA #KardingPH'
    queryABSCBN = 'ABS-CBN #KardingPH'
    queryRelief = '#KardingPH #reliefPH'


    tweets = await client.search_tweet(queryRelief, product='Top')

    tweet_list = []
    for tweet in tweets:
        tweet_data = {
            "tweet_count": tweet_count,
            "user_name": tweet.user.name,
            "text": tweet.text,
            "created_at": str(tweet.created_at),
            "reposts_count": tweet.retweet_count,
            "likes_count": tweet.favorite_count,
            "replies_count": tweet.reply_count,
        }
        tweet_list.append(tweet_data)
        tweet_count += 1

    # Dump to JSON file
    with open('jsonData/typhoonkardingrelief.json', 'w', encoding='utf-8') as f:
        json.dump(tweet_list, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    asyncio.run(main())