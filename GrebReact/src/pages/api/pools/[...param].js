import { FindPoolerByEmail } from '../../../lib/database'
import { CreateWeekData, CreateSeasonData } from '../../../utils/pools'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);

    if (req.query['param'].length === 1) {
        const seasonstr = req.query['param'][0];
        const season = Number(seasonstr);

        const seasondata = await CreateSeasonData(season, pooler);
        res.status(200).json(seasondata);
    }
    else if (req.query['param'].length === 2) {
        const [seasonstr, weekstr] = req.query['param'];
        const season = Number(seasonstr);
        const week = Number(weekstr);

        const weekdata = await CreateWeekData(season, week, pooler);
        res.status(200).json(weekdata);
    }
}
