import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { IoSpeedometer } from "react-icons/io5";
import Dashboard from "./Dashboard";
import Wallets from "./Wallets";
class admin extends Component {
  state = {
    admin: "user_dashboard",
  };
  render() {
    return (
      <div className="admine">
        <div className="side_bar">
          <Button
            onClick={() => {
              this.setState({ admin: "user_dashboard" });
            }}
          >
            User Dashboard
            <IoSpeedometer size="20px" className="icon" />
          </Button>
          <Button
            onClick={() => {
              this.setState({ admin: "admin_dashboard" });
            }}
          >
            Admin Dashboard
            <IoSpeedometer size="20px" className="icon" />
          </Button>
          <Button
            onClick={() => {
              this.setState({ admin: "wallets" });
            }}
          >
            Wallets
            <IoSpeedometer size="20px" className="icon" />
          </Button>
        </div>
        <div className="content_bar">
          {this.state.admin === "user_dashboard" && <Dashboard />}
          {this.state.admin === "wallets" && <Wallets />}
        </div>
      </div>
    );
  }
}

export default admin;
