import { FindPoolerByEmail, FindCurrentWeekForPooler, } from '../../../lib/database';
import { CreateWeekData } from '../../../utils/pools'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);

    const [season, week] = await FindCurrentWeekForPooler(pooler);

    const weekdata = await CreateWeekData(season, week, pooler);
    res.status(200).json(weekdata);
}
