import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Team from './components/Team';
import Compare from './components/Compare';
import PokemonDetails from './components/PokemonDetails';
import './App.css';

function App() {
  return (
    <Router>
      {/* Calling the navbar */}
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/create" element={<Compare />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
