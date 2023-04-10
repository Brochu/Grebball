import { FindPoolerByEmail } from '../../../lib/database';
//import { GetWeek } from '../../../utils/football'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);
    console.log(pooler);

    //TODO: Build week data for results table
    res.status(200).json({ });
}
