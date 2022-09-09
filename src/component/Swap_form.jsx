import React, { Component, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import seedx_logo from "../img/seedx_logo.png";
import USDT_logo from "../img/USDT_logo.png";
import getWallet from "./wallet_connect";
import { RiSwapFill } from "react-icons/ri";
import tokenAbi from "../contracts/abi/ERC20.json";
import swapContractAbi from "../contracts/abi/swap_contract_abi.json";

class swap_form extends Component {
  state = {
    seedx: "10 SEEDX",
    usdt: "15 USDT",
    swapped: false,
    usdtValue: parseFloat(0.0),
    seedxValue: parseFloat(0.0),
    swapBtn: "Approve",
  };
  componentDidMount = async () => {
    await this.loadBlockchainData();
  };

  loadBlockchainData = async () => {
    let { web3, account } = await getWallet();
    let usdtContract = new web3.eth.Contract(
      tokenAbi.abi,
      tokenAbi.usdtAddress
    );
    let seedxContract = new web3.eth.Contract(
      tokenAbi.abi,
      tokenAbi.seedxAddress
    );

    let usdtBalance = await usdtContract.methods.balanceOf(account[0]).call();
    this.setState({
      usdt:
        web3.utils.fromWei(web3.utils.toBN(usdtBalance).toString(), "mwei") +
        " USDT",
    });
    let seedxBalance = await seedxContract.methods.balanceOf(account[0]).call();
    this.setState({
      seedx:
        web3.utils.fromWei(web3.utils.toBN(seedxBalance).toString(), "ether") +
        " SEEDX",
    });
  };

  tokenPositionSwap = () => {
    if (this.state.swapped) {
      this.setState({ swapped: false });
      this.setState({ usdtValue: this.state.usdtValue });
      this.setState({ seedxValue: this.state.usdtValue * 1 });
    } else {
      this.setState({ swapped: true });
      this.setState({ usdtValue: this.state.seedxValue * 0.75 });
      this.setState({ seedxValue: this.state.seedxValue });
    }
  };

  usdtSwappingValue = async (e) => {
    console.log(e.target.value, "usdt");
    this.setState({ usdtValue: e.target.value });
    this.setState({ seedxValue: e.target.value * 1 });
  };
  seedxSwappingValue = async (e) => {
    console.log(e.target.value, "seedx");
    this.setState({ seedxValue: e.target.value });
    this.setState({ usdtValue: e.target.value * 0.75 });
  };

  swapTokens = async () => {
    let { web3, account } = await getWallet();
    let SwapContract = new web3.eth.Contract(
      swapContractAbi.abi,
      swapContractAbi.address
    );
    let usdtContract = new web3.eth.Contract(
      tokenAbi.abi,
      tokenAbi.usdtAddress
    );
    let seedxContract = new web3.eth.Contract(
      tokenAbi.abi,
      tokenAbi.seedxAddress
    );

    if (!this.state.swapped) {
      try {
        this.setState({ swapBtn: "Approving..." });
        await usdtContract.methods
          .approve(
            swapContractAbi.address,
            web3.utils.toWei(
              this.state.usdtValue.toString(),
              "mwei"
            )
          )
          .send({ from: account[0] });
        this.setState({ swapBtn: "Swapping..." });
        await SwapContract.methods
          .buyToken(
            web3.utils.toWei(
              this.state.seedxValue.toString(),
              "ether"
            )
          )
          .send({ from: account[0] });
        this.setState({ swapBtn: "Approve" });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        this.setState({ swapBtn: "Approving...." });
        await seedxContract.methods
          .approve(
            swapContractAbi.address,
            web3.utils.toWei(
              this.state.seedxValue.toString(),
              "ether"
            )
          )
          .send({ from: account[0] });
        this.setState({ swapBtn: "Swapping..." });
        await SwapContract.methods
          .sellToken(
            web3.utils.toWei(
              this.state.seedxValue.toString(),
              "ether"
            )
          )
          .send({ from: account[0] });
        this.setState({ swapBtn: "Approve" });
      } catch (error) {
        console.log(error.message);
      }
    }
    await this.loadBlockchainData();
  };
  render() {
    return (
      <Container fluid className="swap_form py-5">
        <Container>
          <div className="swap_form_box mx-auto">
            <h5 className="fw-bold">Swap</h5>
            {this.state.swapped ? (
              <div className="content">
                <Form.Control
                  onChange={this.seedxSwappingValue}
                  value={this.state.seedxValue}
                  type="number"
                  placeholder="0.0"
                />
                <Button>
                  <img src={seedx_logo} alt="" height="24px" />
                  SEEDX
                </Button>
                <Form.Label>Balance: {this.state.seedx}</Form.Label>
              </div>
            ) : (
              <div className="content">
                <Form.Control
                  onChange={this.usdtSwappingValue}
                  value={this.state.usdtValue}
                  type="number"
                  placeholder="0.0"
                />
                <Button>
                  <img
                    src={USDT_logo}
                    alt=""
                    height="22px"
                    style={{ marginRight: "6px" }}
                  />{" "}
                  USDT
                </Button>
                <Form.Label>Balance: {this.state.usdt} </Form.Label>
              </div>
            )}
            <div onClick={this.tokenPositionSwap} className="swap_arrow">
              <RiSwapFill size="32px" />
            </div>
            {this.state.swapped ? (
              <div className="content">
                <Form.Control
                  onChange={this.usdtSwappingValue}
                  value={this.state.usdtValue}
                  type="number"
                  placeholder="0.0"
                />
                <Button>
                  <img
                    src={USDT_logo}
                    alt=""
                    height="22px"
                    style={{ marginRight: "6px" }}
                  />{" "}
                  USDT
                </Button>
                <Form.Label>Balance: {this.state.usdt} </Form.Label>
              </div>
            ) : (
              <div className="content">
                <Form.Control
                  onChange={this.seedxSwappingValue}
                  value={this.state.seedxValue}
                  type="number"
                  placeholder="0.0"
                />
                <Button>
                  <img src={seedx_logo} alt="" height="24px" />
                  SEEDX
                </Button>
                <Form.Label>Balance: {this.state.seedx}</Form.Label>
              </div>
            )}
            <div className="d-grid">
              <Button onClick={this.swapTokens}>{this.state.swapBtn}</Button>
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}

export default swap_form;
