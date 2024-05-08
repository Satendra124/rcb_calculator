class Team {
  constructor(name, gamesPlayed, wins, losses, points, netRunRate) {
    this.name = name;
    this.gamesPlayed = gamesPlayed;
    this.wins = wins;
    this.losses = losses;
    this.points = points;
    this.netRunRate = netRunRate;
  }
}

class Match {
  constructor(team1, team2) {
    this.team1 = team1;
    this.team2 = team2;
  }
}

// Function to clone the teams map
function cloneTeamsMap(teams) {
  const cloned = {};
  for (const name in teams) {
    const team = teams[name];
    cloned[name] = new Team(
      team.name,
      team.gamesPlayed,
      team.wins,
      team.losses,
      team.points,
      team.netRunRate
    );
  }
  return cloned;
}

// Function to aggregate results
function aggregateResults(results) {
  const finalResults = {};
  results.forEach((result) => {
    for (const team in result) {
      if (!finalResults[team]) {
        finalResults[team] = 0;
      }
      finalResults[team] += result[team];
    }
  });
  return finalResults;
}

// Simulate matches and return results
async function simulateMatches(teams, matches, index) {
  if (index >= matches.length) {
    const top4 = getTop4Teams(teams);
    return [top4];
  }

  const currentMatch = matches[index];
  const teamsWin1 = cloneTeamsMap(teams);
  const teamsWin2 = cloneTeamsMap(teams);

  teamsWin1[currentMatch.team1].wins++;
  teamsWin1[currentMatch.team1].points += 2;
  teamsWin1[currentMatch.team2].losses++;

  teamsWin2[currentMatch.team2].wins++;
  teamsWin2[currentMatch.team2].points += 2;
  teamsWin2[currentMatch.team1].losses++;

  const results1 = simulateMatches(teamsWin1, matches, index + 1);
  const results2 = simulateMatches(teamsWin2, matches, index + 1);

  return (await results1).concat(await results2);
}

// Determine top 4 teams
function getTop4Teams(teams) {
  const teamsArray = Object.values(teams).sort(
    (a, b) => b.points - a.points || b.netRunRate - a.netRunRate
  );
  const top4 = {};
  for (let i = 0; i < 4; i++) {
    top4[teamsArray[i].name] = 1;
  }
  return top4;
}

// Main calculation function
async function calculate(teams, matches) {
  const results = await simulateMatches(teams, matches, 0);
  const finalResults = aggregateResults(results);
  const totalScenarios = 1 << matches.length; // 2^number of matches

  console.log("Total scenarios:", totalScenarios);
  const percentages = {};
  for (const team in finalResults) {
    percentages[team] = (finalResults[team] / totalScenarios) * 100;
  }
  return percentages;
}

export default calculate;
export { Team, Match };
