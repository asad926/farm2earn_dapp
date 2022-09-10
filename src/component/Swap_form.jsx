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
    web3:null,
    account:"",
    USDT:null,
    SeedX:null,
    Swap:null,
    buyRate:0.0,
    sellRate:0.0
  };
  componentDidMount = async () => {
    await this.loadBlockchainData();
    window.ethereum.on("accountsChanged",async()=>{
      await this.loadBlockchainData()
    });
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
    let swapContract = new web3.eth.Contract(
      swapContractAbi.abi,
      swapContractAbi.address
    );
    this.setState({web3:web3,account:account[0],USDT:usdtContract,SeedX:seedxContract,Swap:swapContract})
    let buy_rate = await swapContract.methods.buy_rate().call();
    let sell_rate = await swapContract.methods.sell_rate().call();
    this.setState({buyRate:web3.utils.fromWei(web3.utils.toBN(buy_rate).toString(), "ether")})
    this.setState({sellRate:web3.utils.fromWei(web3.utils.toBN(sell_rate).toString(), "ether")})
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
      this.setState({ seedxValue: this.state.usdtValue * this.state.buyRate });
    } else {
      this.setState({ swapped: true });
      this.setState({ usdtValue: this.state.seedxValue * this.state.sellRate });
      this.setState({ seedxValue: this.state.seedxValue });
    }
  };

  usdtSwappingValue = async (e) => {
    console.log(e.target.value, "usdt");
    this.setState({ usdtValue: e.target.value });
    this.setState({ seedxValue: e.target.value * this.state.buyRate });
  };
  seedxSwappingValue = async (e) => {
    console.log(e.target.value, "seedx");
    this.setState({ seedxValue: e.target.value });
    this.setState({ usdtValue: e.target.value * this.state.sellRate });
  };

  swapTokens = async () => {
    let { web3, account,USDT,SeedX,Swap } = this.state;

    if (!this.state.swapped) {
      try {
        this.setState({ swapBtn: "Approving..." });
        await USDT.methods
          .approve(
            swapContractAbi.address,
            web3.utils.toWei(
              this.state.usdtValue.toString(),
              "mwei"
            )
          )
          .send({ from: account });
        this.setState({ swapBtn: "Swapping..." });
        await Swap.methods
          .buyToken(
            web3.utils.toWei(
              this.state.seedxValue.toString(),
              "ether"
            )
          )
          .send({ from: account });
        this.setState({ swapBtn: "Approve" });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        this.setState({ swapBtn: "Approving...." });
        await SeedX.methods
          .approve(
            swapContractAbi.address,
            web3.utils.toWei(
              this.state.seedxValue.toString(),
              "ether"
            )
          )
          .send({ from: account });
        this.setState({ swapBtn: "Swapping..." });
        await Swap.methods
          .sellToken(
            web3.utils.toWei(
              this.state.seedxValue.toString(),
              "ether"
            )
          )
          .send({ from: account });
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
