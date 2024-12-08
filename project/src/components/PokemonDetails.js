import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

var PokemonDetails = () => {
  var { name } = useParams(); // Get Pokémon name from URL
  var [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    var fetchPokemonDetails = async () => {
      try {
        var response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        var data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (!pokemon) return <p>Loading...</p>;

  return (
    <Container>
      <h1 className="text-center">{pokemon.name.toUpperCase()}</h1>
      {/* Use official-artwork image for high-definition display */}
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        className="d-block mx-auto my-4"
        style={{ maxWidth: '300px' }}
      />
      <h2>General Information</h2>
      <ul>
        <li>Height: {pokemon.height}</li>
        <li>Weight: {pokemon.weight}</li>
        <li>Type: {pokemon.types.map((type) => type.type.name).join(', ')}</li>
      </ul>
      <h2>Battle Stats</h2>
      <ul>
        {pokemon.stats.map((stat) => (
          <li key={stat.stat.name}>
            {stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default PokemonDetails;
