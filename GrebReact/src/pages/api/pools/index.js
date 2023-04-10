import { FindPoolerByEmail, FindCurrentWeekForPooler, FindPoolInfoByPooler } from '../../../lib/database';
import { GetWeek } from '../../../utils/football'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);

    //TODO: Build week data for results table
    res.status(200).json({ });
}
