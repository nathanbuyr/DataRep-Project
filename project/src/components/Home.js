import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
var Home = () => {
  var [pokemonList, setPokemonList] = useState([]);
  var [team, setTeam] = useState([]); // State to track the team being built
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    var fetchPokemon = async () => {
      try {
        var response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
        var data = await response.json();
        var pokemonWithDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            var pokemonDetails = await fetch(pokemon.url);
            return await pokemonDetails.json();
          })
        );
        setPokemonList(pokemonWithDetails);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    fetchPokemon();
  }, []);

  // Add a Pokémon to the team
  var addToTeam = (pokemon) => {
    if (team.length < 6 && !team.some((member) => member.id === pokemon.id)) {
      setTeam([...team, pokemon]);
    } else {
      alert('Your team is full or this Pokémon is already in your team!');
    }
  };

  // Save the team to the server
  var saveTeam = async () => {
    if (team.length === 0) {
      alert('Your team is empty! Add some Pokémon before saving.');
      return;
    }

    try {
      var response = await axios.post('http://localhost:4000/api/teams', {
        team: team.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.other['official-artwork'].front_default,
        })),
      });
      alert('Team saved successfully!');
      setTeam([]); // Clear the team after saving
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team. Please try again.');
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">Pokémon Team Builder</h1>

      {/* Team Builder Section */}
      <div className="mb-4">
        <h2>Your Team</h2>
        <ListGroup>
          {team.map((pokemon) => (
            <ListGroup.Item key={pokemon.id}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                style={{ width: '50px', marginLeft: '10px' }}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Button
          variant="success"
          className="mt-3"
          onClick={saveTeam}
          disabled={team.length === 0}
        >
          Save Team
        </Button>
      </div>

      {/* Pokémon Cards */}
      <Container className="d-flex flex-wrap justify-content-center">
        {pokemonList.map((pokemon) => (
          <Card
            key={pokemon.id}
            className="pokemon-card"
            style={{ width: '200px', margin: '10px', cursor: 'pointer' }}
            onClick={() => navigate(`/pokemon/${pokemon.id}`)} // Navigate to the Pokémon details page
          >
            <Card.Img
              variant="top"
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              style={{ height: '200px', objectFit: 'contain' }}
            />
            <Card.Body>
              <Card.Title className="text-center">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </Card.Title>
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering navigation
                  addToTeam(pokemon);
                }}
              >
                Add to Team
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </Container>
  );
};

export default Home;
