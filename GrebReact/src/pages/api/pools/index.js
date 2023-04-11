import {
    FindPoolerByEmail,
    FindCurrentWeekForPooler,
    FindPoolInfoByPooler,
    FindPoolPicksForWeek
} from '../../../lib/database';

import { GetWeek } from '../../../utils/football'

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
    //TODO: Convert python logic to js
    return { };

    //results = []

    //for poolerid, picks in poolpicks.items():
    //    total = 0
    //    res = {}

    //    for match in matches:
    //        hscore = int(match['intHomeScore']) if match['intHomeScore'] is not None else 0
    //        ascore = int(match['intAwayScore']) if match['intAwayScore'] is not None else 0

    //        hwin = hscore > ascore
    //        tied = hscore == ascore

    //        hpick = picks[match['idEvent']] == GetTeamShortName(match['strHomeTeam'])
    //        rightpick = (hwin and hpick) or (not(hwin) and not(hpick))

    //        others = [ p[match['idEvent']] if i != poolerid else '' for i, p in poolpicks.items() ]
    //        unique = not(picks[match['idEvent']] in others)

    //        if tied:
    //            score = 1
    //        elif rightpick and unique:
    //            score = int(GetCorrectScore(week) * 1.5)
    //        elif rightpick:
    //            score = GetCorrectScore(week)
    //        else:
    //            score = 0

    //        res[match['idEvent']] = {
    //            'pick': picks[match['idEvent']],
    //            'score': score,
    //        }

    //        total = total + score

    //    results.append({ 'pid': poolerid, 'scores': res, 'total': total })

    //return results
}

function GetCorrectScore(week_num) {
    let n = 0;
    if (typeof week_num == string) {
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
