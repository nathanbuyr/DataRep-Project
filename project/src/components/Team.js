import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

var Team = () => {
  var [savedTeams, setSavedTeams] = useState([]); // State to store all saved teams

  useEffect(() => {
    var fetchSavedTeams = async () => {
      try {
        var response = await axios.get('http://localhost:4000/api/teams'); // Fetch saved teams from server
        setSavedTeams(response.data);
      } catch (error) {
        console.error('Error fetching saved teams:', error);
      }
    };

    fetchSavedTeams();
  }, []);

  // Function to handle deletion of a team
  var handleDelete = async (teamId) => {
    try {
      await axios.delete(`http://localhost:4000/api/teams/${teamId}`);
      setSavedTeams(savedTeams.filter((team) => team._id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Saved Teams</h1>

      {savedTeams.length === 0 && (
        <p className="text-center">No teams saved yet!</p>
      )}

      {savedTeams.length > 0 && (
        savedTeams.map((team, index) => (
          <Card key={index} className="mb-4">
            <Card.Header>
              Team {index + 1}
              <Button
                variant="danger"
                size="sm"
                className="float-end"
                onClick={() => handleDelete(team._id)}
              >
                Delete
              </Button>
            </Card.Header>
            <ListGroup variant="flush">
              {team.team.map((pokemon) => (
                <ListGroup.Item key={pokemon.id}>
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    style={{ width: '50px', marginRight: '10px' }}
                  />
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Team;
