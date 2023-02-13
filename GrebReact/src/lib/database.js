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
