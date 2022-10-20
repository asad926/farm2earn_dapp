import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { IoSpeedometer } from "react-icons/io5";
import tokenAbi from "../contracts/abi/ERC20.json";
import stakingContractAbi from "../contracts/abi/staking_contract_abi.json";
import getWallet from "./wallet_connect";
class dashboard extends Component {
  state = {
    web3 : null,
    account: "",
    totalWallets: 0,
    totalStaked: 0,
    totalUnstaked: 0,
    totalUnstakedReward: 0,
    totalWalletStakes: [],
  };

  componentDidMount = async() => {
    let { web3, account } = await getWallet();
    this.setState({
      web3: web3,
      account: account,
    });
    let stakeContract = new web3.eth.Contract(
      stakingContractAbi.abi,
      stakingContractAbi.address
    );

    let totalStaked = await stakeContract.methods.totalStaked().call();
    let totalUnstaked = await stakeContract.methods.totalUnstaked().call();
    let totalUnstakedReward = await stakeContract.methods.totalRewardCollected().call();
    let totalWalletStakes = []
    let index = 0;
    while(true){

      try {
        let staker = await stakeContract.methods.stakeHolders(index+1).call();
        let stakes = await stakeContract.methods.hasStake(staker).call();
       
        // let keys = Object.keys(...stakes);
        // let values = Object.values(...stakes);
        // console.log("Stakes Keys: ",keys.slice(8, keys.length))
        // console.log("Stakes Values: ",values.slice(8, values.length));
        totalWalletStakes.push(...stakes)
      } catch (error) {
        console.log(error.message)
        break;
      }
      index += 1;
    }

    console.log(totalWalletStakes)
    this.setState({
      totalStaked: web3.utils.fromWei(web3.utils.toBN(totalStaked).toString(), "ether"),
      totalUnstaked: web3.utils.fromWei(web3.utils.toBN(totalUnstaked).toString(), "ether"),
      totalUnstakedReward: web3.utils.fromWei(web3.utils.toBN(totalUnstakedReward).toString(), "ether"),
      totalWalletStakes: totalWalletStakes,
      totalWallets : index
    });

  };
  render() {
    return (
      <div className="dashboard">
        <h2 className="mb-3 d-flex align-items-center">
          <IoSpeedometer
            size="32px"
            style={{ color: "#55984a", marginRight: "16px" }}
          />{" "}
          Dashboard
        </h2>
        <div className="states_box">
          <div className="state">
            <p>Total Wallets</p>
            <span className="value">{this.state.totalWallets}</span>
          </div>
          <div className="state">
            <p>Total Staked Amount</p>
            <span className="value">{this.state.totalStaked} SEEDX</span>
          </div>
          <div className="state">
            <p>Total Unstaked Amount</p>
            <span className="value">{this.state.totalUnstaked} SEEDX</span>
          </div>
          <div className="state">
            <p>Total Unstaked Reward</p>
            <span className="value">{this.state.totalUnstakedReward} SEEDX</span>
          </div>
        </div>
        <div className="table_box">
          <h4 className="mb-4">Unstaking WalletStakes</h4>
          <Table responsive="xxl">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Wallet ID</th>
                <th>Staking Policy ID </th>
                {/* <th>WalletStake ID</th> */}
                <th>Staked Amount (In SEEDX)</th>
                <th>Total Rewards (In SEEDX)</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
              this.state.totalWalletStakes.map((stakes, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{stakes.userWallet}</td>
                <td>{stakes.poolId}</td>
                {/* <td>44</td> */}
                <td>{this.state.web3.utils.fromWei(this.state.web3.utils.toBN(stakes.amount).toString(), "ether")}</td>
                <td>{this.state.web3.utils.fromWei(this.state.web3.utils.toBN(stakes.totalReward).toString(), "ether")}</td>
                <td>{(new Date(parseInt(stakes.stakeAt) * 1000)).toLocaleDateString("en-US")}</td>
                <td>{(new Date((parseInt(stakes.stakeAt)+parseInt(stakes.endAt)) * 1000)).toLocaleDateString("en-US")}</td>
                <td>
                  <Button>View Transaction</Button>
                </td>
              </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default dashboard;
