import os
from pymongo import MongoClient

DB = MongoClient(os.environ.get('MONGO_URL'))[str(os.environ.get('MONGO_DB_NAME'))]

def GetPoolers():
    for pooler in DB.poolers.find():
        name = pooler['name']
        fav = pooler['favTeam']
        print(f' : {name} => {fav}')

    return {}
