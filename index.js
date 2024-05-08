import express from "express";
import calculate, { Team, Match } from "./calculator.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.post("/calculate", async (req, res) => {
  try {
    // Assume the JSON data is sent in the request body
    const data = req.body;

    // Create the teams map from the JSON points data
    const teams = data.points.reduce(
      (acc, [name, gamesPlayed, wins, losses, points, netRunRate]) => {
        acc[name] = new Team(
          name,
          gamesPlayed,
          wins,
          losses,
          points,
          netRunRate
        );
        return acc;
      },
      {}
    );

    // Create the matches array from the JSON matches data
    const matches = data.matches.map(
      ([team1, team2]) => new Match(team1, team2)
    );

    // Calculate the probabilities using the imported function
    const results = await calculate(teams, matches);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
