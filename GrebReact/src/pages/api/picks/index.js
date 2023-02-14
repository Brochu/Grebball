import { FindPoolerByEmail, FindCurrentWeekForPooler } from '../../../lib/database';

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);

    let [season, week] = await FindCurrentWeekForPooler(pooler);
    console.log(`season = ${season}; week = ${week}`);

    res.status(200).json({
        season: season,
        week: week,
    });
}
