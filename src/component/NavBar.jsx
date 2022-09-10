import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import F2E_one from "../img/F2E one.png";
import getWallet from "./wallet_connect";

class navBar extends Component {
  state = { connect_btn: "Connect Wallet" };

  componentDidMount = async () => {
    await this.connectWallet();
    window.ethereum.on("accountsChanged",async()=>{
      await this.connectWallet()
    });
  };

  connectWallet = async () => {
    let wallet = await getWallet();
    if (wallet.account.length > 0) {
      let account =
        wallet.account[0].substr(0, 4) +
        "......" +
        wallet.account[0].substr(38, 41);
      this.setState({ connect_btn: account });
    }
  };
  render() {
    return (
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <Link to="#" className="navbar-brand">
            <img src={F2E_one} alt="" width="220px" />
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">SEEDX</Nav.Link>
              <Link className="nav-link" to="/swap">
                Swap
              </Link>
              <Link className="nav-link" to="/staking">
                Staking
              </Link>
            </Nav>
            <Button onClick={this.connectWallet} variant="outline-success">{this.state.connect_btn}</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default navBar;
