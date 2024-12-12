import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Compare() {
  var [savedTeams, setSavedTeams] = useState([]);
  var [selectedPokemon1, setSelectedPokemon1] = useState(null);
  var [selectedPokemon2, setSelectedPokemon2] = useState(null);
  var [stats1, setStats1] = useState(null);
  var [stats2, setStats2] = useState(null);
  var [comparisonMessage, setComparisonMessage] = useState('');

  // Fetch saved teams from the backend
  useEffect(function () {
    axios.get('http://localhost:4000/api/teams')
      .then(function (response) {
        setSavedTeams(response.data);
      })
      .catch(function (error) {
        console.error('Error fetching teams:', error);
      });
  }, []);

  // Fetch stats for a specific Pokémon
  function fetchPokemonStats(pokemonId, setStats) {
    axios.get('https://pokeapi.co/api/v2/pokemon/' + pokemonId)
      .then(function (response) {
        var data = response.data;
        setStats({
          id: pokemonId,
          name: data.name,
          stats: data.stats.map(function (stat) {
            return { name: stat.stat.name, value: stat.base_stat };
          }),
          image: data.sprites.front_default
        });
      })
      .catch(function (error) {
        console.error('Error fetching stats:', error);
        setStats(null);
      });
  }

  // Compare the two selected Pokémon
  function handleCompare() {
    if (selectedPokemon1) {
      fetchPokemonStats(selectedPokemon1.id, setStats1);
    }
    if (selectedPokemon2) {
      fetchPokemonStats(selectedPokemon2.id, setStats2);
    }
    setComparisonMessage('');
  }

  // Determine which Pokémon has better stats
  useEffect(function () {
    if (stats1 && stats2) {
      var score1 = 0;
      var score2 = 0;

      for (var i = 0; i < stats1.stats.length; i++) {
        if (stats1.stats[i].value > stats2.stats[i].value) {
          score1++;
        } else if (stats1.stats[i].value < stats2.stats[i].value) {
          score2++;
        }
      }

      if (score1 > score2) {
        setComparisonMessage(stats1.name.charAt(0).toUpperCase() + stats1.name.slice(1) + ' has better stats!');
      } else if (score2 > score1) {
        setComparisonMessage(stats2.name.charAt(0).toUpperCase() + stats2.name.slice(1) + ' has better stats!');
      } else {
        setComparisonMessage('Both Pokémon are evenly matched!');
      }
    }
  }, [stats1, stats2]);

  // Create options for selecting Pokémon from saved teams
  function renderPokemonOptions() {
    return savedTeams.flatMap(function (team) {
      return team.team.map(function (pokemon) {
        return (
          <option key={pokemon.id} value={JSON.stringify(pokemon)}>
            {pokemon.name} (ID: {pokemon.id})
          </option>
        );
      });
    });
  }

  // Show stats for one Pokémon, highlighting higher stats in bold
  function renderStatComparison(stats, otherStats) {
    if (!stats || !otherStats) return null;

    return stats.stats.map(function (stat, index) {
      var statValue = stat.value;
      var otherStatValue = otherStats.stats[index] ? otherStats.stats[index].value : 0;
      var isHigher = statValue > otherStatValue;

      return (
        <li key={index}>
          <strong>{stat.name}:</strong>{' '}
          <span style={{ fontWeight: isHigher ? 'bold' : 'normal' }}>{statValue}</span>
        </li>
      );
    });
  }

  return (
    <Container className="my-4">
      <h1 className="text-center">Compare Pokémon Stats</h1>
      <Row className="mb-4">
        <Col md={5}>
          <Form.Group>
            <Form.Label>Select First Pokémon</Form.Label>
            <Form.Select
              onChange={function (e) {
                setSelectedPokemon1(JSON.parse(e.target.value));
              }}
            >
              <option>Select a Pokémon</option>
              {renderPokemonOptions()}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>Select Second Pokémon</Form.Label>
            <Form.Select
              onChange={function (e) {
                setSelectedPokemon2(JSON.parse(e.target.value));
              }}
            >
              <option>Select a Pokémon</option>
              {renderPokemonOptions()}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button onClick={handleCompare}>Compare</Button>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {stats1 && (
            <Card>
              <Card.Img variant="top" src={stats1.image} alt={stats1.name} />
              <Card.Body>
                <Card.Title>{stats1.name}</Card.Title>
                <ul>{renderStatComparison(stats1, stats2)}</ul>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={6}>
          {stats2 && (
            <Card>
              <Card.Img variant="top" src={stats2.image} alt={stats2.name} />
              <Card.Body>
                <Card.Title>{stats2.name}</Card.Title>
                <ul>{renderStatComparison(stats2, stats1)}</ul>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {comparisonMessage && (
        <div className="text-center mt-4">
          <h3>{comparisonMessage}</h3>
        </div>
      )}
    </Container>
  );
}

export default Compare;
