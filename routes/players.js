const express = require('express');
const router = express.Router();
const Match = require('../models/matches');
const Ball = require('../models/balls');

// let getTeams = () => {
//   return new Promise((resolve, reject) => {
//     Match.aggregate([
//       {
//         $group: {
//           _id: { $cond: [{ $eq: ["$team1", "Rising Pune Supergiants"] }, "Rising Pune Supergiant", "$team1"] }
//         }
//       }
//     ], (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         teamCodes = [];
//         result = result.map(elem => {
//           teamCodes.push(elem._id.match(/[A-Z]/g).join(''));
//           return elem._id;
//         });
//         resolve(result);
//       }
//     });
//   });
// }

router.get('/', (req, res) => {
  // getTeams()
  //   .then(data => {
  //     res.status(200).json(data);
  //   })
  //   .catch(err => res.status(500).send("Error"));
  res.status(200).json("Players under construction!!!");
})

router.get('/:pname', (req, res) => {
  // getTeams()
  //   .then(data => {
  //     if (teamCodes.includes(req.params.teamCode.toUpperCase())) {
  //       getTeamYearWins(data[teamCodes.indexOf(req.params.teamCode.toUpperCase())])
  //         .then(details => {
  //           res.status(200).json(details);
  //         });
  //     } else {
  //       res.status(404).send(" Failed to load resource: the server responded with a status of 404 (Not Found)");
  //     }
  //   })
  //   .catch(err => res.status(500).send("Error"));
  res.status(200).json(req.params.pname + " also under construction!!!");
})

// router.get('/:teamCode/:year', (req, res) => {
//   getTeams()
//     .then(data => {
//       if (teamCodes.includes(req.params.teamCode.toUpperCase())) {
//         let name = data[teamCodes.indexOf(req.params.teamCode.toUpperCase())];
//         let yearWins;
//         getTeamYearWins(name)
//           .then(details => yearWins = details)
//           .then(() => {
//             if (Object.keys(yearWins[name]).includes(req.params.year)) {
//               getTeamYearDetails(name, req.params.year)
//                 .then(result => {
//                   res.status(200).json(result);
//                 });
//             } else {
//               res.status(404).send(" Failed to load resource: the server responded with a status of 404 (Not Found)");
//             }
//           });
//       } else {
//         res.status(404).send(" Failed to load resource: the server responded with a status of 404 (Not Found)");
//       }
//     })
//     .catch(err => res.status(500).send("Error"));
// })

module.exports = router;