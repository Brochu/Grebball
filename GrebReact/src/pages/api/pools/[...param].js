import { FindPoolerByEmail } from '../../../lib/database'
import { CreateWeekData } from '../../../utils/pools'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);

    const [seasonstr, weekstr] = req.query['param'];
    const season = Number(seasonstr);
    const week = Number(weekstr);

    const weekdata = await CreateWeekData(season, week, pooler);
    res.status(200).json(weekdata);
}
