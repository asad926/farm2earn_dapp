import React, { Component } from "react";
import "./Staking.scss";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import seedx_logo from "../img/seedx_logo.png";
import tokenAbi from "../contracts/abi/ERC20.json";
import stakingContractAbi from "../contracts/abi/staking_contract_abi.json";
import getWallet from "./wallet_connect";
import axios from "axios";
import History from "./stakingHistory";
import Pagination from "react-js-pagination";
import "./pagination.scss"
let allHistory

class staking extends Component
{
  state = {
    lock_period: "30",
    APY_rate: "23%",
    mini_stake: "100",
    btn_disable: true,
    seedx_balance: "0",
    policy1: "active",
    policy2: "",
    policy3: "",
    stakeAmount: "0",
    alertMsg: "",
    poolId: 1,
    TotalStaked: [],
    stakeShows: [],
    activePage: 1
  };

  componentDidMount = async () =>
  {
    await this.loadBlockchainData()
    window.ethereum.on("accountsChanged", async () =>
    {
      await this.loadBlockchainData()
    });
  }

  polygonGasStation = async () =>
  {
    let estimatedGas = await axios.get("https://gasstation-mainnet.matic.network/v2");
    let gas_price = parseFloat(Math.random() * (estimatedGas.data.standard.maxFee - estimatedGas.data.safeLow.maxFee + 1.0000) + estimatedGas.data.safeLow.maxFee).toFixed(9)
    return this.state.web3.utils.toWei("" + gas_price, 'gwei');
  }

  loadBlockchainData = async () =>
  {
    let { web3, account } = await getWallet();

    let seedxContract = new web3.eth.Contract(
      tokenAbi.abi,
      tokenAbi.seedxAddress_
    );
    let stakeContract = new web3.eth.Contract(
      stakingContractAbi.abi,
      stakingContractAbi.address
    );
    let stakedPools = await stakeContract.methods.hasStake(account[0]).call();
    let pool_1 = await stakeContract.methods.Pools(1).call();
    let time = (pool_1.lockTime / 86400 / 30.417).toFixed(0);
    let rate = pool_1.rewardRate + "%";
    let stakes = [];
    let res = await this.loadDatabase(account[0]);
    stakedPools.forEach((stake,index)=>{
      let stk = { ...stake}
      stk["stakeId"] = index+1;
      stk["hash"] = res.hash[index];
      stakes.push(stk);
    })
    this.setState({
      web3: web3, account: account[0],
      SeedX: seedxContract,
      Stake: stakeContract,
      lock_period: time,
      APY_rate: rate,
      TotalStaked: stakes.reverse()
    })
    let seedxBalance = await seedxContract.methods.balanceOf(account[0]).call();
    this.setState({
      seedx_balance:
        web3.utils.fromWei(web3.utils.toBN(seedxBalance).toString(), "ether")
    });

    this.handlePageChange(1)
  };

  loadDatabase = async(wallet)=>{
    try {
    let response = await axios.get('http://34.237.142.184/api/transactions/'+wallet)  
    return response.data;
    } catch (error) {
        console.error('Error:', error) 
    }
}


saveDatabase = async(id,trxHash)=>{
  id += "2"
  let data = {
    id:id,
    hash:[trxHash]
  }
  let res = await this.loadDatabase(id);
  if(res){
        data = {...res};
        data.hash.push(trxHash)
        axios.put('http://34.237.142.184/api/transactions/'+data.id, data)
         .then(response => console.log('update success')); 
  }else{
      axios.post('http://34.237.142.184/api/transactions/', data)
      .then(response => console.log('insert success')); 
  }
}

  handlePageChange = pageNumber => {
    this.setState({
      stakeShows: []
    });
    console.log(`active page is ${pageNumber}`);
      let totalStaked = [...this.state.TotalStaked];
      let endIndex = pageNumber * 3; 
      let startIndex = endIndex - 3;
      let stakeToShow = [...totalStaked.slice(startIndex,endIndex)];
      
    allHistory = stakeToShow.map((stake) => {
      return <History key={stake.stakeId} stakeData={{ stakes: stake, stakeId: stake.stakeId }} />;
  })
        this.setState({
          stakeShows: stakeToShow,
          activePage: pageNumber
        });
  };

  set_policy1 = async () =>
  {
    let pool_1 = await this.state.Stake.methods.Pools(1).call();
    let time = (pool_1.lockTime / 86400 / 30.417).toFixed(0);
    this.setState({ policy1: "active", poolId: 1 });
    this.setState({ policy2: "" });
    this.setState({ policy3: "" });
    this.setState({ lock_period: time });
    this.setState({ APY_rate: pool_1.rewardRate + "%" });
  };
  set_policy2 = async () =>
  {
    let pool_2 = await this.state.Stake.methods.Pools(2).call();
    let time = (pool_2.lockTime / 86400 / 30.417).toFixed(0);
    this.setState({ policy1: "" });
    this.setState({ policy2: "active", poolId: 2 });
    this.setState({ policy3: "" });
    this.setState({ lock_period: time });
    this.setState({ APY_rate: pool_2.rewardRate + "%" });
  };
  set_policy3 = async () =>
  {
    let pool_3 = await this.state.Stake.methods.Pools(3).call();
    let time = (pool_3.lockTime / 86400 / 30.417).toFixed(0);
    this.setState({ policy1: "" });
    this.setState({ policy2: "" });
    this.setState({ policy3: "active", poolId: 3 });
    this.setState({ lock_period: time });
    this.setState({ APY_rate: pool_3.rewardRate + "%" });
  };

  stake = async () =>
  {
    let { web3, account, SeedX, Stake } = this.state;
    try
    {
      this.setState({ alertMsg: "Approving...", btn_disable: true });
      let stakeInWei = web3.utils.toWei(
        this.state.stakeAmount.toString(),
        "ether"
      )
      let matic = web3.utils.toWei("1", "ether");
      await SeedX.methods
        .approve(
          stakingContractAbi.address,
          stakeInWei
        )
        .send({ from: account, gasPrice: await this.polygonGasStation() });

      this.setState({ alertMsg: "Staking..." });
      let trx = await Stake.methods
        .stake(
          stakeInWei,
          this.state.poolId
        )
        .send({
          from: account,
          gasPrice: await this.polygonGasStation(),
          value: matic
        });
       await this.saveDatabase(account,trx.transactionHash);
        await this.loadBlockchainData();
      this.setState({ alertMsg: "Staked Successfully!" });
    } catch (error)
    {
      this.setState({ alertMsg: error.message });
      console.log(error);
    }

  };

  validateStakes = (e) =>
  {
    if (e.target.value >= 100)
    {
      this.setState({
        stakeAmount: e.target.value,
        btn_disable: false,
        alertMsg: ""
      });
    } else
    {
      this.setState({
        stakeAmount: "",
        btn_disable: true,
        alertMsg: "Minimum 100 SEEDX required for staking"
      });
    }
  };
  render()
  {

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
                  <h4 className="text-center">Select Staking Period</h4>
                  <hr />
                  <div className="stacking_period mb-2">
                    <Button
                      variant="outline-success"
                      className={this.state.days30}
                      onClick={this.set_policy1}
                    >
                      30 MONTHS
                    </Button>
                    <Button
                      variant="outline-success"
                      className={this.state.days185}
                      onClick={this.set_policy2}
                    >
                      48 MONTHS
                    </Button>
                    <Button
                      variant="outline-success"
                      className={this.state.days365}
                      onClick={this.set_policy3}
                    >
                      60 MONTHS
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="d-flex flex-column me-4">
                      <p>
                        Lock period: <span>{this.state.lock_period}</span> Months
                      </p>
                      <p>Min. Amount: {this.state.mini_stake} SEEDX</p>
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
                    Balance: {this.state.seedx_balance} SEEDX
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      placeholder="0"
                      aria-label="Recipient's username with two button addons"
                      type="number"
                      onChange={this.validateStakes}
                    />
                    <Button onClick={this.stake} variant="outline-success" disabled={this.state.btn_disable}>
                      Stake
                    </Button>
                  </InputGroup>
                  <span className="fs-6" style={{ color: "green" }}>
                    {this.state.alertMsg}
                  </span>
                </div>
                <div className="d-flex flex-column">
                 
                  {this.state.TotalStaked.length <= 0 ?
                    <p>No Staking history yet!!!. Start staking....</p>
                    :
                     <div><Row>
                      {allHistory}
                      </Row>
                      <div className="left d-flex flex-column">
                      <Pagination className="pagination"
                      activePage={this.state.activePage}
                      itemsCountPerPage={3}
                      totalItemsCount={this.state.TotalStaked.length}
                      pageRangeDisplayed={3}
                      onChange={this.handlePageChange}
                    />
                    </div>
                    </div>
                  }
                  
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
