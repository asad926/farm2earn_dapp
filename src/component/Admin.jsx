import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { IoSpeedometer } from "react-icons/io5";
import Dashboard from "./Dashboard";
class admin extends Component {
  state = {};
  render() {
    return (
      <div className="admine">
        <div className="side_bar">
          <Button>
            User Dashboard
            <IoSpeedometer size="20px" className="icon" />
          </Button>
          <Button>
            Admin Dashboard
            <IoSpeedometer size="20px" className="icon" />
          </Button>
          <Button>
            Wallets
            <IoSpeedometer size="20px" className="icon" />
          </Button>
        </div>
        <div className="content_bar">
          <Dashboard />
        </div>
      </div>
    );
  }
}

export default admin;
