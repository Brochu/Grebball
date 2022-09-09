import requests

sNameMap = {
    'ARI': 'Arizona Cardinals',
    'ATL': 'Atlanta Falcons',
    'BAL': 'Baltimore Ravens',
    'BUF': 'Buffalo Bills',
    'CAR': 'Carolina Panthers',
    'CHI': 'Chicago Bears',
    'CIN': 'Cincinnati Bengals',
    'CLE': 'Cleveland Browns',
    'DAL': 'Dallas Cowboys',
    'DEN': 'Denver Broncos',
    'DET': 'Detroit Lions',
    'GB' : 'Green Bay Packers',
    'HOU': 'Houston Texans',
    'IND': 'Indianapolis Colts',
    'JAX': 'Jacksonville Jaguars',
    'KC' : 'Kansas City Chiefs',
    'LA' : 'Los Angeles Rams',
    'LAC': 'Los Angeles Chargers',
    'LV' : 'Las Vegas Raiders',
    'MIA': 'Miami Dolphins',
    'MIN': 'Minnesota Vikings',
    'NE' : 'New England Patriots',
    'NO' : 'New Orleans Saints',
    'NYG': 'New York Giants',
    'NYJ': 'New York Jets',
    'PHI': 'Philadelphia Eagles',
    'PIT': 'Pittsburgh Steelers',
    'SEA': 'Seattle Seahawks',
    'SF' : 'San Francisco 49ers',
    'TB' : 'Tampa Bay Buccaneers',
    'TEN': 'Tennessee Titans',
    'WAS': 'Washington Commanders'
}

lNameMap = {
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
}

def GetTeamShortName(longname):
    return lNameMap[longname]

def GetTeamLongName(shortname):
    return sNameMap[shortname]

def GetWeek(season, week):
    url = "https://www.thesportsdb.com/api/v1/json/2/eventsround.php"

    # Gets the results for a given season and week
    # 01 - 18: Regular season
    # 19 - 21: Post season
    # 22: Final game (SuperBowl)

    # Special handling of round values for TheSportDB
    if week == '19':
        realWeek = 160
    elif week == '20':
        realWeek = 125
    elif week == '21':
        realWeek = 150
    elif week == '22':
        realWeek = 200
    else:
        realWeek = week;

    params = { 'id': 4391, 'r': realWeek, 's': season }
    result = requests.get(url = url, params = params).json()
    # for m in result['events']:
    #     away = GetTeamShortName(m['strAwayTeam'])
    #     home = GetTeamShortName(m['strHomeTeam'])
    #     print(f' : {m["idEvent"]} => {away} vs. {home}')

    return result['events'];

def GetWeekName(week_num):
    if (type(week_num) == str):
        n = int(week_num)
    else:
        n = week_num

    if   n == 19: return 'WC'
    elif n == 20: return 'DV'
    elif n == 21: return 'CF'
    elif n == 22: return 'SB'
    else:         return str(n)

def GetWeekLongName(week_num):
    if (type(week_num) == str):
        n = int(week_num)
    else:
        n = week_num

    if   n == 19: return 'WildCards'
    elif n == 20: return 'Division Round'
    elif n == 21: return 'Conference Championship'
    elif n == 22: return 'SuperBowl'
    else:         return f'Semaine {week_num}'
