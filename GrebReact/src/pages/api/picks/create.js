import { FindPoolerByEmail } from '../../../lib/database';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only send post request to the endpoint' });
        return;
    }

    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);
    console.log(pooler);

    const data = JSON.parse(req.body);
    console.log(data);

    //TODO: Implement the rest of this logic
    res.status(200).json({ });
}
