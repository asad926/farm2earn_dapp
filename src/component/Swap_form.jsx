import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import seedx_logo from "../img/seedx_logo.png";
import USDT_logo from "../img/USDT_logo.png";
import getWallet from "./wallet_connect";
import { RiSwapFill } from "react-icons/ri";
class swap_form extends Component {
  state = {};
  componentDidMount=async()=>{

    let wallet = await getWallet();

    console.log(wallet);
 
   }
  render() {
    return (
      <Container fluid className="swap_form vh-100 pt-5">
        <Container>
          <div className="swap_form_box mx-auto">
            <h5 className="fw-bold">Swap</h5>
            <div className="content">
              <Form.Control type="number" placeholder="0.0" />
              <Button>
                <img src={seedx_logo} alt="" height="24px" /> SEEDX
              </Button>
            </div>
            <div className="swap_arrow">
              <RiSwapFill size="32px" />
            </div>
            <div className="content">
              <Form.Control type="number" placeholder="0.0" />
              <Button>
                <img
                  src={USDT_logo}
                  alt=""
                  height="22px"
                  style={{ marginRight: "6px" }}
                />{" "}
                USDT
              </Button>
            </div>
            <div className="d-grid">
              <Button>Buy</Button>
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}

export default swap_form;
