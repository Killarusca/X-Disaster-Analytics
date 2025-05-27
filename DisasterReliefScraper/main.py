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
    queryHenryCommunity = '#HenryPH "Typhoon Henry" relief rescue volunteer donation support emergency'
    queryHenryPreparedness = '("Typhoon Henry" OR #HenryPH) (prepare OR advisory OR warning OR "safety tips" OR evacuation OR "go bag" OR "emergency kit" OR "secure home" OR "stay informed" OR bulletin OR "signal no." OR "disaster kit" OR "family plan" OR "early warning" OR guidance OR readiness OR precaution)'
    queryKristinePreparedness = '#KristinePH'

    query_abscbn_henryph = 'ABSCBN #HenryPH'

    query_gma_henryph = 'from:gmanewsweather rescue OR relief OR donation OR #HenryPH'


    government_keywords = [
        'gov', 'dilg', 'dswd', 'red cross', 'philstar', 'official', 'president', 'mayor', 'senator', 'congress',
        'department', 'city', 'municipality', 'barangay', 'pnp', 'bfp', 'pagasa', 'nfa', 'dotr', 'doh',
        'vice president', 'leni robredo', 'rodrigo duterte', 'marcos', 'bbm', 'bongbong marcos',
    ]       
    guidance_keywords = [
        "prepare", "advisory", "warning", "safety tips", "evacuation", "bulletin", "signal no.",
        "guidance", "stay informed", "secure home", "emergency kit", "go bag", "family plan",
        "early warning", "readiness", "precaution", "alert", "hotline", "info", "update"
    ]
    action_keywords = [
        "donation", "volunteer", "relief goods", "rescue", "need help", "call for", "mobilize",
        "support", "aid", "looking for", "we need", "tulong", "donasyon", "community pantry",
        "help us", "contribute"
    ]

    government_tweets = []
    community_tweets = []
    tweet_count_guidance = 0
    tweet_count_action = 0
    guidance_tweets = []
    action_tweets = []

    tweets = await client.search_tweet(queryKristinePreparedness  , product='Top')

    tweet_list = []

    
    for tweet in tweets:
        tweet_text_lower = tweet.text.lower() if tweet.text else ""
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
        is_guidance = any(keyword in tweet_text_lower for keyword in guidance_keywords)
        is_action = any(keyword in tweet_text_lower for keyword in action_keywords)

        if is_guidance: # Prioritize guidance if both might be true, or if it's clearly guidance
            tweet_data["tweet_count"] = tweet_count_guidance
            guidance_tweets.append(tweet_data)
            tweet_count_guidance += 1
        elif is_action: # If not guidance, but it's action
            tweet_data["tweet_count"] = tweet_count_action
            action_tweets.append(tweet_data)
            tweet_count_action += 1

        # Save categorized preparedness tweets
    with open('jsonData/typhoonKristine_comm.json', 'w', encoding='utf-8') as f_guidance:
        json.dump(guidance_tweets, f_guidance, ensure_ascii=False, indent=4)
        print(f"Saved guidance preparedness tweets to jsonData/typhoonKristine_guidance.json")

    with open('jsonData/typhoonKristine_gov.json', 'w', encoding='utf-8') as f_action:
        json.dump(action_tweets, f_action, ensure_ascii=False, indent=4)
        print(f"Saved action preparedness tweets to jsonData/typhoonKristine_action.json")


    #test 123
    # # Save to separate files
    # with open('jsonData/typhoonHenry_guidance.json', 'w', encoding='utf-8') as f:
    #     json.dump(government_tweets, f, ensure_ascii=False, indent=4)
    # with open('jsonData/typhoonHenry_action.json', 'w', encoding='utf-8') as f:
    #     json.dump(community_tweets, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    asyncio.run(main())