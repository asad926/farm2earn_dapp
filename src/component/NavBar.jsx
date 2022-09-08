import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import F2E_one from "../img/F2E one.webp";
class navBar extends Component {
  state = {};
  render() {
    return (
      <Navbar bg="light" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand href="#">
            <img src={F2E_one} alt="" width="200px" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="#action1">Home</Nav.Link>
              <Nav.Link href="#action2">Login</Nav.Link>
              <Nav.Link href="#action2">About</Nav.Link>
              <Nav.Link href="#action2">Data</Nav.Link>
              <Nav.Link href="#action2">SEEDX</Nav.Link>
              <Nav.Link href="#action2">Team</Nav.Link>
              <Nav.Link href="#action2">Docs</Nav.Link>
              <Nav.Link href="#action2">News</Nav.Link>
              <Nav.Link href="#action2">Contact</Nav.Link>
            </Nav>
            <Button variant="outline-success">connect Wallet</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default navBar;
