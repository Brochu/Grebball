import { GetWeek } from '../../../../utils/football'

export default async function handler(req, res) {
    const [seasonstr, weekstr] = req.query.param;
    const season = Number(seasonstr);
    const week = Number(weekstr);

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
