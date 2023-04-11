import { FindPoolInfoByPooler, FindPoolPicksForWeek, FindPoolPicksForSeason } from '../lib/database'
import { GetWeek, GetTeamShortName } from './football'

export async function CreateWeekData(season, week, pooler) {
    const matchdata = await GetWeek(season, week)
    const matchids = matchdata.map((m) => m['idEvent']);

    const [poolinfo, poolers] = await FindPoolInfoByPooler(pooler)
    let names = {};
    poolers.forEach((p) => names[String(p['_id'])] = p['name']);

    const picks = await FindPoolPicksForWeek(season, week, poolers, matchids);
    const weekresults = CalcPoolResults( matchdata, picks, week);

    return {
        'pooldata': poolinfo,
        'poolernames': names,
        'weekdata': {'season': season, 'week': week},
        'matches': matchdata,
        'results': weekresults,
    };
}

export async function CreateSeasonData(season, pooler) {
    const [poolinfo, poolers] = await FindPoolInfoByPooler(pooler)
    let names = {};
    poolers.forEach((p) => names[String(p['_id'])] = p['name']);

    const seasonpicks = await FindPoolPicksForSeason(season, poolers)
    let results = [];
    for (let w in seasonpicks) {
        results.push(CalcPoolResults(GetWeek(season, w+1), seasonpicks[w], w+1));
    }

    let totals = [];
    for (let w in results) {
        const result = results[w];
        let temp = {};
        result.forEach((r) => temp[r['pid']] = 0);
        totals.push(temp);
    }
    //fulltotals = { str(pooler['_id']) : 0 for pooler in poolers }

    //for t in totals:
    //    for pid, score in t.items():
    //        fulltotals[pid] = fulltotals[pid] + score

    return {
        'pooldata': poolinfo,
        'poolernames': names,
        'seasoninfo': season,
        'totals': [],
        'fulltotals': {},
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
