import { FindPoolerByEmail } from '../../../lib/database'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);

    res.status(200).json(pooler);
}
