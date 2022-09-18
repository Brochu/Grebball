const lNameMap = {
    'Arizona Cardinals'    : 'ARI',
    'Atlanta Falcons'      : 'ATL',
    'Baltimore Ravens'     : 'BAL',
    'Buffalo Bills'        : 'BUF',
    'Carolina Panthers'    : 'CAR',
    'Chicago Bears'        : 'CHI',
    'Cincinnati Bengals'   : 'CIN',
    'Cleveland Browns'     : 'CLE',
    'Dallas Cowboys'       : 'DAL',
    'Denver Broncos'       : 'DEN',
    'Detroit Lions'        : 'DET',
    'Green Bay Packers'    : 'GB',
    'Houston Texans'       : 'HOU',
    'Indianapolis Colts'   : 'IND',
    'Jacksonville Jaguars' : 'JAX',
    'Kansas City Chiefs'   : 'KC',
    'Los Angeles Rams'     : 'LA',
    'Los Angeles Chargers' : 'LAC',
    'Las Vegas Raiders'    : 'LV',
    'Oakland Raiders'      : 'LV',
    'Miami Dolphins'       : 'MIA',
    'Minnesota Vikings'    : 'MIN',
    'New England Patriots' : 'NE',
    'New Orleans Saints'   : 'NO',
    'New York Giants'      : 'NYG',
    'New York Jets'        : 'NYJ',
    'Philadelphia Eagles'  : 'PHI',
    'Pittsburgh Steelers'  : 'PIT',
    'Seattle Seahawks'     : 'SEA',
    'San Francisco 49ers'  : 'SF',
    'Tampa Bay Buccaneers' : 'TB',
    'Tennessee Titans'     : 'TEN',
    'Washington'           : 'WAS',
    'Washington Commanders': 'WAS',
    'Washington Redskins'  : 'WAS'
};

export const GetTeamShortName = (longname) => {
    return lNameMap[longname];
};

export const GetLongWeekName = (weeknum) => {
    return '' if true
};

//def GetWeekName(week_num):
//    if (type(week_num) == str):
//        n = int(week_num)
//    else:
//        n = week_num
//
//    if   n == 19: return 'WC'
//    elif n == 20: return 'DV'
//    elif n == 21: return 'CF'
//    elif n == 22: return 'SB'
//    else:         return str(n)
//
//def GetWeekLongName(week_num):
//    if (type(week_num) == str):
//        n = int(week_num)
//    else:
//        n = week_num
//
//    if   n == 19: return 'WildCards'
//    elif n == 20: return 'Division Round'
//    elif n == 21: return 'Conference Championship'
//    elif n == 22: return 'SuperBowl'
//    else:         return f'Semaine {week_num}'
