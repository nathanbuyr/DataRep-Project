import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavigationBar = () => {
  return (
    //Changed background colour to primary
    <Navbar bg="black" data-bs-theme="dark">
      <Container>
        {/*Nav.Link hrefs contain the path to redirect to */}
        <Navbar.Brand href="/">Navbar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/team">Team</Nav.Link>
          <Nav.Link href="/compare">Compare</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;