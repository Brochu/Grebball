import { MongoClient } from 'mongodb';

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

export async function FindPoolerByEmail(e) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    const users = await db.collection("users").find({ email: e }).toArray();
    const uid = users[0]._id;

    const poolers = await db.collection("poolers").find({ user_id: uid }).toArray();
    return poolers[0];
}
