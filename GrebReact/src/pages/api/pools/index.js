import {
    FindPoolerByEmail,
    FindCurrentWeekForPooler,
    FindPoolInfoByPooler,
    FindPoolPicksForWeek
} from '../../../lib/database';

import { GetWeek, GetTeamShortName } from '../../../utils/football'

export default async function handler(req, res) {
    const e = req.headers['pooler-email'];
    const pooler = await FindPoolerByEmail(e);

    const [season, week] = await FindCurrentWeekForPooler(pooler);

    const weekdata = await CreateWeekData(season, week, pooler);
    res.status(200).json(weekdata);
}

async function CreateWeekData(season, week, pooler) {
    const matchdata = await GetWeek(season, week)
    const matchids = matchdata.map((m) => m['idEvent']);

    const [poolinfo, poolers] = await FindPoolInfoByPooler(pooler)
    const picks = await FindPoolPicksForWeek(season, week, poolers, matchids);
    const weekresults = CalcPoolResults( matchdata, picks, week);

    return {
        'pooldata': poolinfo,
        'poolernames': [],
        'weekdata': {'season': season, 'week': week},
        'matches': matchdata,
        'results': weekresults,
    };
}

function CalcPoolResults(matches, poolpicks, week) {
    let results = []

    for (let key in poolpicks) {
        let total = 0;
        let res = {};

        for (let i in matches) {
            const match = matches[i];

            let hscore = 0;
            if (match['intHomeScore']) { hscore = Number(match['intHomeScore']); }
            let ascore = 0;
            if (match['intAwayScore']) { ascore = Number(match['intAwayScore']); }

            const hwin = hscore > ascore;
            const tied = hscore == ascore;

            const hpick = poolpicks[key][match['idEvent']] == GetTeamShortName(match['strHomeTeam']);
            const rightpick = (hwin && hpick) || (!hwin && !hpick);

            let others = [];
            for (let o in poolpicks) {
                if (o != key) {
                    others.push(poolpicks[o][match['idEvent']]);
                }
            }
            const unique = !others.includes(poolpicks[key][match['idEvent']])

            let score = 0;
            if (tied) {
                score = 1;
            }
            else if (rightpick && unique) {
                score = Number(GetCorrectScore(week) * 1.5);
            }
            else if (rightpick) {
                score = GetCorrectScore(week);
            }
            else {
                score = 0;
            }

            res[match['idEvent']] = {
                'pick': poolpicks[key][match['idEvent']],
                'score': score,
            };
            total += score
        }

        results.push({ 'pid': key, 'scores': res, 'total': total })
    }

    return results
}

function GetCorrectScore(week_num) {
    let n = 0;
    if (typeof week_num == String) {
        n = int(week_num)
    }
    else {
        n = week_num
    }

    if      (n == 19) { return 4; }
    else if (n == 20) { return 6; }
    else if (n == 21) { return 8; }
    else if (n == 22) { return 10; }
    else              { return 2; }
}
