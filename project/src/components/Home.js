import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';

var Home = () => {
  var [pokemonList, setPokemonList] = useState([]);
  var navigate = useNavigate();

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

  return (
    <Container className="d-flex flex-wrap justify-content-center">
      <h1 className="text-center w-100 my-4">Pokémon List</h1>
      {pokemonList.map((pokemon) => (
        <Card
          key={pokemon.id}
          style={{ width: '200px', margin: '10px', cursor: 'pointer' }}
          onClick={() => navigate(`/pokemon/${pokemon.name}`)} // Navigate to details page
        >
          {/* Use official-artwork images for high-definition images */}
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
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Home;
