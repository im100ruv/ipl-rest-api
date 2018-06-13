const express = require('express');
const router = express.Router();
const Match = require('../models/matches');
// const Ball = require('../models/balls');

let teamCodes = [];

let getTeams = () => {
  return new Promise((resolve, reject) => {
    Match.aggregate([
      {
        $group: {
          _id: { $cond: [{ $eq: ["$team1", "Rising Pune Supergiants"] }, "Rising Pune Supergiant", "$team1"] }
        }
      }
    ], (err, result) => {
      if (err) {
        reject(err);
      } else {
        teamCodes = [];
        result = result.map(elem => {
          teamCodes.push(elem._id.match(/[A-Z]/g).join(''));
          return elem._id;
        });
        resolve(result);
      }
    });
  });
}

let getTeamYearWins = teamName => {
  if (teamName == "Rising Pune Supergiant") {
    teamName = ["Rising Pune Supergiant", "Rising Pune Supergiants"]
  } else {
    teamName = [teamName];
  }
  return new Promise((resolve, reject) => {
    Match.aggregate([
      {
        $match: { $or: [{ team1: { $in: teamName } }, { team2: { $in: teamName } }] }
      },
      {
        $group: {
          _id: {
            team: { $cond: [{ $eq: ["$winner", "Rising Pune Supergiants"] }, "Rising Pune Supergiant", { $cond: [{ $eq: ["$winner", ""] }, "No Result", "$winner"] }] },
            wins: "$season"
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          winner: "$_id.team",
          year: "$_id.wins",
          wins: "$count"
        }
      }, {
        $match: { winner: { $in: teamName } }
      }, {
        $group: {
          _id: "$winner",
          wins: {
            $push: {
              year: "$year",
              wins: "$wins"
            }
          }
        }
      }
    ], (err, result) => {
      if (err) {
        reject(err);
      } else {
        let name = result[0]._id;
        let stdResult = {};
        stdResult[name] = result[0].wins.reduce((acc, elem) => {
          acc[elem.year] = elem.wins;
          return acc;
        }, {});
        resolve(stdResult);
      }
    });
  });
}

let getTeamYearDetails = (teamName, year) => {
  if (teamName == "Rising Pune Supergiant") {
    teamName = ["Rising Pune Supergiant", "Rising Pune Supergiants"]
  } else {
    teamName = [teamName];
  }
  return new Promise((resolve, reject) => {
    Match.aggregate([
      {
        $match: { $and: [ { $or: [ { team1: { $in: teamName } }, { team2: { $in: teamName } } ] }, { season: Number(year) } ] }
      },
      {
        $project: {
          _id: 0,
          date: "$date",
          team1: "$team1",
          team2: "$team2",
          winner: "$winner",
          MoM: "$player_of_match",
          venue: "$venue",
          city: "$city"
        }
      }
    ], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

router.get('/', (req, res) => {
  getTeams()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => res.status(500).send("Error"));
})

router.get('/:teamCode', (req, res) => {
  getTeams()
    .then(data => {
      if (teamCodes.includes(req.params.teamCode.toUpperCase())) {
        getTeamYearWins(data[teamCodes.indexOf(req.params.teamCode.toUpperCase())])
          .then(details => {
            res.status(200).json(details);
          });
      } else {
        res.status(404).send(" Failed to load resource: the server responded with a status of 404 (Not Found)");
      }
    })
    .catch(err => res.status(500).send("Error"));
})

router.get('/:teamCode/:year', (req, res) => {
  getTeams()
    .then(data => {
      if (teamCodes.includes(req.params.teamCode.toUpperCase())) {
        let name = data[teamCodes.indexOf(req.params.teamCode.toUpperCase())];
        let yearWins;
        getTeamYearWins(name)
          .then(details => yearWins = details)
          .then(() => {
            if (Object.keys(yearWins[name]).includes(req.params.year)) {
              getTeamYearDetails(name, req.params.year)
                .then(result => {
                  res.status(200).json(result);
                });
            } else {
              res.status(404).send(" Failed to load resource: the server responded with a status of 404 (Not Found)");
            }
          });
      } else {
        res.status(404).send(" Failed to load resource: the server responded with a status of 404 (Not Found)");
      }
    })
    .catch(err => res.status(500).send("Error"));
})

module.exports = router;
