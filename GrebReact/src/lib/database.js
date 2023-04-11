import { MongoClient } from 'mongodb';

// -------------------------------------------------
// Database connection setup
const uri = process.env.MONGO_URL;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGO_URL) {
    throw new Error('No MongoDB URL provided in .env.local');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;

// -------------------------------------------------
// Helper functions
export async function FindPoolerByEmail(e) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    const users = await db.collection("users").find({ email: e }).toArray();
    const uid = users[0]._id;

    const poolers = await db.collection("poolers").find({ user_id: uid }).toArray();
    return poolers[0];
}

export async function FindPoolInfoByPooler(pooler) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    const pools = await db.collection("pools").find({ _id: pooler['pool_id'] }).toArray();
    const pool = pools[0];

    delete pool['_id'];

    const poolers = await db.collection("poolers").find({ pool_id: pooler['pool_id'] }).toArray();
    return [ pool, poolers ];
}

export async function FindCurrentWeekForPooler(pooler) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    const seasonPipeline = [
        {
            '$match': {
                'pooler_id': pooler['_id'],
            }
        },
        {
            '$group': {
                '_id': '$pooler_id',
                'season_max': { '$max': '$season' },
            }
        }
    ];
    const seasonAg = await db.collection("picks").aggregate(seasonPipeline).toArray();
    const maxseason = seasonAg[0]["season_max"];

    const weekPipeline = [
        {
            '$match': {
                'pooler_id': pooler['_id'],
                'season': maxseason,
            }
        },
        {
            '$group': {
                '_id': '$pooler_id',
                'week_max': { '$max': '$week' },
            }
        }
    ];
    const weekAg = await db.collection("picks").aggregate(weekPipeline).toArray();
    const maxweek = weekAg[0]["week_max"];

    return [maxseason, maxweek];
}

export async function FindPoolPicksForWeek(season, week, poolers, matchids) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    let poolerids = []
    let picks = []

    for (let i in poolers) {
        poolerids.push(poolers[i]['_id'].toString());

        const possiblepicks = await db.collection("picks").find({
            'pooler_id': poolers[i]['_id'],
            'season': season,
            'week': week
        }).toArray();

        if (possiblepicks.length > 0) {
            picks.push(JSON.parse(possiblepicks[0]['pickstring']))
        }
        else {
            const empty = matchids.map((mid) => ({ [mid] : 'na' }));
            picks.push(empty[0])
        }
    }

    const res = {};
    for (const i in poolerids) {
        res[poolerids[i]] = picks[i];
    }
    return res;
}

export async function FindPoolPicksForSeason(season, pooler) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    console.log(season);
    console.log(pooler);
    //picks = []

    //for w in range(1, 23):
    //    incomplete = False
    //    picks.append({});

    //    for p in poolers:
    //        possiblepicks = list(DB.picks.find({
    //            'pooler_id': p['_id'],
    //            'season': season,
    //            'week': w
    //        }))

    //        if len(possiblepicks) > 0:
    //            picks[len(picks)-1][str(p['_id'])] = json.loads(possiblepicks[0]['pickstring'])
    //        else:
    //            incomplete = True

    //    if incomplete:
    //        break

    //return picks
}

export async function InsertNewPicks(pickObj) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    //DB.picks.insert_one(pickObj)
}
