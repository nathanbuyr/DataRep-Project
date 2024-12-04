import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

var Home = () => {
  var [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    var fetchPokemon = async () => {
        var response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50'); // Fetching the api data
        var data = await response.json(); // Converting to JSON

        var pokemonWithDetails = await Promise.all( // Promise makes sure every pokemon is fetched
          data.results.map(async (pokemon) => 
            {
            var pokemonDetails = await fetch(pokemon.url);
            return await pokemonDetails.json();
          })
        );
        setPokemonList(pokemonWithDetails);

    };

    fetchPokemon();
  }, []);

  // Creating the container and cards for each pokemon
  return (
    <Container className="d-flex flex-wrap justify-content-center">
      <h1 className="text-center w-100 my-4">Pokémon List</h1>
      {pokemonList.map((pokemon) => 
      (
        <Card
          key={pokemon.id}
          style={{ width: '150px', margin: '10px' }}
        >
          <Card.Img
            variant="top"
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <Card.Body>
            <Card.Title className="text-center">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Card.Title>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Home;
