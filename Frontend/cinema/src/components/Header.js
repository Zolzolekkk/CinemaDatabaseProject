import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";

const Header = ({user, setUser}) => {
  const navigate = useNavigate();
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" style={{ color: "gold" }}>
          <FontAwesomeIcon icon={faVideo} style={{ paddingRight: "10px" }} />
          CinemaDB
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            {/* <NavLink className ="nav-link" to="/watchList">Watch List</NavLink>    */}
            <NavLink className="nav-link" to="/programme">
              Programme
            </NavLink>
          </Nav>
          {user == null ? (
            <div>
              <Button
                variant="outline-info"
                className="me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline-info"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          ) : <Button
          variant="outline-info"
          onClick={() => setUser(null)}
        >
          Log out
        </Button>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
