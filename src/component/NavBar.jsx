import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import F2E_one from "../img/F2E one.webp";
import getWallet from "./wallet_connect";

class navBar extends Component {
  state = {connect_btn:"Connect Wallet"};

  componentDidMount = async()=>{
    await this.connectWallet();
  }

   connectWallet = async()=> {
    let wallet = await getWallet();
    if(wallet.account.length > 0){
      let account = wallet.account[0].substr(0,4)+"......"+wallet.account[0].substr(38,41)
    this.setState({connect_btn:account})
    }
 
  }
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
            <Button onClick={this.connectWallet} variant="outline-success">{this.state.connect_btn}</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default navBar;
