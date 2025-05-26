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

    tweet_count_gov = 0         # <-- Add this
    tweet_count_comm = 0  
    tweet_count = 0
    query = 'GMA #KardingPH'
    queryABSCBN = 'ABS-CBN #KardingPH'
    queryRelief = '#KardingPH #reliefPH'
    queryCarina = 'Carina OR #CarinaPH OR Typhoon Carina relief OR rescue OR volunteer OR donation OR support OR emergency' 
    queryHenryCommunity = (
    '#HenryPH '
    'volunteer donation relief drive community pantry '
    'rescue team emergency help public support '
    'awareness spread info bayanihan Filipino spirit '
    'news update TV Patrol GMA News ABS-CBN '
    'DSWD NDRRMC LGU barangay mayor governor '
    'Philippine government official statement announcement '
    'relief goods evacuation rescue operation state of calamity '
    'government aid disaster response public advisory'
    )

    government_keywords = [
        'gov', 'dilg', 'dswd', 'red cross', 'philstar', 'official', 'president', 'mayor', 'senator', 'congress',
        'department', 'city', 'municipality', 'barangay', 'pnp', 'bfp', 'pagasa', 'nfa', 'dotr', 'doh',
        'ang probinsyano', 'vice president', 'angat buhay', 'leni robredo', 'angat bayanihan'
    ]   
    government_tweets = []
    community_tweets = []

    tweets = await client.search_tweet(queryHenryCommunity, product='Top')

    tweet_list = []
    for tweet in tweets:
        user = tweet.user.name.lower()
        tweet_data = {
            "tweet_count": None,  # Will set below
            "user_name": tweet.user.name,
            "text": tweet.text,
            "created_at": str(tweet.created_at),
            "reposts_count": tweet.retweet_count,
            "likes_count": tweet.favorite_count,
            "replies_count": tweet.reply_count,
        }
        if any(keyword in user for keyword in government_keywords):
            tweet_data["tweet_count"] = tweet_count_gov
            government_tweets.append(tweet_data)
            tweet_count_gov += 1
        else:
            tweet_data["tweet_count"] = tweet_count_comm
            community_tweets.append(tweet_data)
            tweet_count_comm += 1

    # Save to separate files
    with open('jsonData/typhoonHenry_gov.json', 'w', encoding='utf-8') as f:
        json.dump(government_tweets, f, ensure_ascii=False, indent=4)
    with open('jsonData/typhoonHenry_community.json', 'w', encoding='utf-8') as f:
        json.dump(community_tweets, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    asyncio.run(main())