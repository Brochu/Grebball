import { FindPoolerByEmail, FindCurrentWeekForPooler } from '../../../lib/database';
import { GetWeek } from '../../../utils/football'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);
    let [season, week] = await FindCurrentWeekForPooler(pooler);

    const weekinfo = {
        'season': season,
        'week': week,
    };
    const weekdata = await GetWeek(season, week);

    res.status(200).json({
        'weekinfo': weekinfo,
        'weekdata': weekdata,
    });
}
