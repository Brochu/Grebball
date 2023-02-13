import clientPromise from '../../../lib/database'

export default async function handler(req, res) {
    const mongo = await clientPromise;
    const db = mongo.db(process.env.MONGO_DB_NAME);

    const e = req.headers['pooler-email'];
    const users = await db.collection("users").find({ email: e }).toArray();
    const uid = users[0]._id;

    const poolers = await db.collection("poolers").find({ user_id: uid }).toArray();
    const pooler = poolers[0];
    res.status(200).json(pooler);
}
