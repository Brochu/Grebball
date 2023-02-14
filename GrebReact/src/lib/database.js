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
