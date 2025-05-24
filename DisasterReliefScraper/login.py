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
    await client.login(auth_info_1=username, auth_info_2=email, password=password)
    client.save_cookies('cookies.json')

if __name__ == "__main__":
    asyncio.run(main())