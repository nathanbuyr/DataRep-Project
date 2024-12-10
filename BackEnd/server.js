const express = require('express');
const app = express();
const port = 4000;

const cors = require('cors'); // Allows communication between the React app and Node/Express server
app.use(cors());

// CORS is a security feature built into browsers that restricts web pages from making requests to a different domain or port than the one that served the web page.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Body Parsing is used to parse the body of an incoming HTTP request in a middleware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@datarepproject.bhppf.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema for a Pokémon team
const teamSchema = new mongoose.Schema({
  team: [
    {
      id: Number,
      name: String,
      image: String,
    },
  ],
});

// Data model for teams
const Team = mongoose.model('Team', teamSchema);

// POST route to save a new team
app.post('/api/teams', async (req, res) => {
  try {
    const newTeam = new Team({ team: req.body.team });
    await newTeam.save();
    res.status(201).json({ message: 'Team created successfully', team: newTeam });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// GET route to fetch all saved teams
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find({});
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// DELETE route to delete a team by ID
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const teamId = req.params.id;
    const deletedTeam = await Team.findByIdAndDelete(teamId);
    if (deletedTeam) {
      res.status(200).send({ message: 'Team deleted successfully', team: deletedTeam });
    } else {
      res.status(404).send({ error: 'Team not found' });
    }
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).send({ error: 'Failed to delete team' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
