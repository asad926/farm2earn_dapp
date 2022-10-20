import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { IoSpeedometer } from "react-icons/io5";
import Dashboard from "./Dashboard";
import Wallets from "./Wallets";
import getWallet from "./wallet_connect";
class admin extends Component {
  state = {
    admin: "admin_dashboard",
  };

  componentDidMount = async()=> {
    await this.validateAdminWallet();
    window.ethereum.on("accountsChanged", async () => {
      await this.validateAdminWallet();
    });
   
  }

  validateAdminWallet = async()=>{
    let {account} = await getWallet();
    if (account[0].toLowerCase() !== "0x1dc61850cd03f6b35cbe0f1b2faa0e328d0f6a81") {
      window.location.replace("/staking")
    }
  }

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
          {this.state.admin === "admin_dashboard" && <Dashboard />}
          {this.state.admin === "wallets" && <Wallets />}
        </div>
      </div>
    );
  }
}

export default admin;
