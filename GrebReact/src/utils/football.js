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

export const Teams = [
    'Arizona Cardinals',
    'Atlanta Falcons',
    'Baltimore Ravens',
    'Buffalo Bills',
    'Carolina Panthers',
    'Chicago Bears',
    'Cincinnati Bengals',
    'Cleveland Browns',
    'Dallas Cowboys',
    'Denver Broncos',
    'Detroit Lions',
    'Green Bay Packers',
    'Houston Texans',
    'Indianapolis Colts',
    'Jacksonville Jaguars',
    'Kansas City Chiefs',
    'Los Angeles Rams',
    'Los Angeles Chargers',
    'Las Vegas Raiders',
    'Miami Dolphins',
    'Minnesota Vikings',
    'New England Patriots',
    'New Orleans Saints',
    'New York Giants',
    'New York Jets',
    'Philadelphia Eagles',
    'Pittsburgh Steelers',
    'Seattle Seahawks',
    'San Francisco 49ers',
    'Tampa Bay Buccaneers',
    'Tennessee Titans',
    'Washington Commanders',
];

export const GetTeamShortName = (longname) => {
    return lNameMap[longname];
};

export const GetWeekShortName = (weeknum) => {
    var n = 0;
    if (typeof(weeknum) == "string")
        n = parseInt(weeknum);
    else
        n = weeknum

    if (n == 19) return 'WC';
    if (n == 20) return 'DV';
    if (n == 21) return 'CF';
    if (n == 22) return 'SB';
    else return n.toString();
};

export const GetWeekLongName = (weeknum) => {
    var n = 0;
    if (typeof(weeknum) == "string")
        n = parseInt(weeknum);
    else
        n = weeknum

    if (n == 19) return 'WildCards';
    if (n == 20) return 'Division Round';
    if (n == 21) return 'Conference Championship';
    if (n == 22) return 'SuperBowl';
    else return `Semaine ${n.toString()}`;
};
