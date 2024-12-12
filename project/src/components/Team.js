// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios'; // For making HTTP requests

// Main component to display and manage Pokémon teams
const Team = () => {
  // State to store all saved teams
  const [savedTeams, setSavedTeams] = useState([]);

  // State to keep track of the Pokémon being edited
  const [editPokemon, setEditPokemon] = useState(null);

  // State to track changes made to a Pokémon's details
  const [editedDetails, setEditedDetails] = useState({});

  // Fetch all saved teams from the server when the component loads
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/teams'); // Get teams from backend
        setSavedTeams(response.data); // Store the teams in state
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams(); // Call the function to fetch teams
  }, []); // Empty dependency array ensures this runs only once

  // Function to delete a team from the server
  const handleDelete = async (teamId) => {
    try {
      await axios.delete(`http://localhost:4000/api/teams/${teamId}`); // Delete team by ID
      setSavedTeams(savedTeams.filter((team) => team._id !== teamId)); // Update state
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  // Function to open the edit modal for a specific Pokémon
  const handleEdit = (pokemon, teamId) => {
    setEditPokemon({ id: pokemon.id, name: pokemon.name, image: pokemon.image, teamId: teamId }); // Store the Pokémon being edited
    setEditedDetails({ id: pokemon.id, name: pokemon.name, image: pokemon.image }); // Pre-fill the form with the current details
  };


  // Function to save changes made to a Pokémon
  const handleSaveEdit = async () => {
    const teamId = editPokemon.teamId; // Get the ID of the team being edited

    // Find the team being updated and update its Pokémon list
    const updatedTeam = savedTeams.find((team) => team._id === teamId);

    updatedTeam.team = updatedTeam.team.map((pokemon) => {
      if (pokemon.id === editPokemon.id) {
        return editedDetails; // Replace with the edited details if IDs match
      } else {
        return pokemon; // Keep the original Pokémon if IDs do not match
      }
    });

    try {
      // Send the updated team to the server
      await axios.put(`http://localhost:4000/api/teams/${teamId}`, {
        team: updatedTeam.team,
      });

      // Update the local state to reflect the changes
      setSavedTeams(
        savedTeams.map((team) => // Iterate over the savedTeams array
          team._id === teamId      // Check if the current team's ID matches the teamId being updated
            ? updatedTeam         // If it matches, replace the current team with the updated team
            : team                // If it doesn't match, keep the team as is
        )
      );


      setEditPokemon(null); // Close the edit modal
    } catch (error) {
      console.error('Error saving edits:', error);
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Saved Teams</h1>

      {/* Show a message if no teams are saved */}
      {savedTeams.length === 0 && (
        <p className="text-center">No teams saved yet!</p>
      )}

      {/* Loop through all saved teams and display them */}
      {savedTeams.map((team, index) => (
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
            {/* Loop through each Pokémon in the team */}
            {team.team.map((pokemon) => (
              <ListGroup.Item key={pokemon.id}>
                <img
                  src={pokemon.image} // Pokémon image
                  alt={pokemon.name}
                  style={{ width: '50px', marginRight: '10px' }}
                />
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                <Button
                  variant="info"
                  size="sm"
                  className="float-end"
                  onClick={() => handleEdit(pokemon, team._id)}
                >
                  Edit
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      ))}

      {/* Edit Pokémon Modal */}
      {editPokemon && (
        <Modal show onHide={() => setEditPokemon(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Pokémon</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Input for Pokémon name */}
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editedDetails.name}
                  onChange={(e) =>
                    setEditedDetails({
                      id: editedDetails.id,
                      name: e.target.value,
                      image: editedDetails.image, // Keep the image URL the same
                    })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={editedDetails.image}
                  onChange={(e) =>
                    setEditedDetails({
                      id: editedDetails.id,
                      name: editedDetails.name, // Keep the name the same
                      image: e.target.value, // Update the image URL here
                    })
                  }
                />
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditPokemon(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Team;