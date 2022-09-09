import React, { Component } from "react";
import "./Staking.scss";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import seedx_logo from "../img/seedx_logo.png";
class staking extends Component {
  state = {
    lock_period: "30",
    APY_rate: "3%",
    days30: "active",
    days185: "",
    days365: "",
  };
  set_30days = () => {
    this.setState({ days30: "active" });
    this.setState({ days185: "" });
    this.setState({ days365: "" });
    this.setState({ lock_period: "30" });
    this.setState({ APY_rate: "3%" });
  };
  set_185days = () => {
    this.setState({ days30: "" });
    this.setState({ days185: "active" });
    this.setState({ days365: "" });
    this.setState({ lock_period: "185" });
    this.setState({ APY_rate: "23%" });
  };
  set_365days = () => {
    this.setState({ days30: "" });
    this.setState({ days185: "" });
    this.setState({ days365: "active" });
    this.setState({ lock_period: "365" });
    this.setState({ APY_rate: "52%" });
  };
  render() {
    return (
      <div className="staking py-5">
        <Container>
          <div className="content py-5 px-2">
            <Row>
              <Col xs={12} lg={6}>
                <div className="left">
                  <img src={seedx_logo} alt="" />
                </div>
              </Col>
              <Col xs={12} lg={6}>
                <div className="right py-5 px-2">
                  <h4 className="text-center">Select Staking Policy</h4>
                  <hr />
                  <div className="stacking_period mb-2">
                    <Button
                      variant="outline-success"
                      className={this.state.days30}
                      onClick={this.set_30days}
                    >
                      30 DAYS
                    </Button>
                    <Button
                      variant="outline-success"
                      className={this.state.days185}
                      onClick={this.set_185days}
                    >
                      185 DAYS
                    </Button>
                    <Button
                      variant="outline-success"
                      className={this.state.days365}
                      onClick={this.set_365days}
                    >
                      365 DAYS
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="d-flex flex-column me-4">
                      <p>
                        Lock period: <span>{this.state.lock_period}</span> Days
                      </p>
                      <p>Min. Amount: 500 SEEDX</p>
                    </div>
                    <div className="d-flex flex-column">
                      <p>
                        APY Rate:{" "}
                        <span className="fs-5 fw-bold">
                          {this.state.APY_rate}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Form.Label htmlFor="" className="fs-4 fw-bold">
                    Balance: 0 SEEDX
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      placeholder="0"
                      aria-label="Recipient's username with two button addons"
                      type="number"
                    />
                    <Button variant="outline-success" disabled>
                      Stake
                    </Button>
                  </InputGroup>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default staking;
