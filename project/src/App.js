import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Team from './components/Team';
import Compare from './components/Compare';
import PokemonDetails from './components/PokemonDetails';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Calling the navbar */}
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
