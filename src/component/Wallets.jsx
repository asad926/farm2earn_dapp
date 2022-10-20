import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import stakingContractAbi from "../contracts/abi/staking_contract_abi.json";
import getWallet from "./wallet_connect";
class wallets extends Component
{
  state = {
    web3: null,
    account: "",
    totalWallets: 0,
    totalStaked: 0,
    totalUnstaked: 0,
    totalUnstakedReward: 0,
    totalWalletStakes: [],
  }

  componentDidMount = async () =>
  {
    await this.loadStakingData();
  }

  loadStakingData = async()=>{
    let { web3, account } = await getWallet();
    this.setState({
      web3: web3,
      account: account,
    });
    let stakeContract = new web3.eth.Contract(
      stakingContractAbi.abi,
      stakingContractAbi.address
    );
    let totalWalletStakes = []
    let index = 0;
    while (true)
    {

      try
      {
        let staker = await stakeContract.methods.stakeHolders(index + 1).call();
        let stakes = await stakeContract.methods.hasStake(staker).call();
        console.log(stakes)
        let totalActiveStakes = stakes.reduce((total, b)=>{
          return total + parseInt(b.amount);
         }, 0);
         let totalReward = stakes.reduce((total, b)=>{
          return total + parseInt(b.totalReward);
         }, 0);
        let userStakes = {
          wallet: stakes[0].userWallet,
          total_policies: stakes.length,
          active_stakes: web3.utils.fromWei(web3.utils.toBN(totalActiveStakes).toString(), "ether"),
          total_reward: web3.utils.fromWei(web3.utils.toBN(totalReward).toString(), "ether") 

        }
        totalWalletStakes.push(userStakes)
      } catch (error)
      {
        console.log(error.message)
        break;
      }
      index += 1;
    }

    console.log(totalWalletStakes)
    this.setState({
      totalWalletStakes: totalWalletStakes,
    })

  }

  render()
  {
    return (
      <div className="wallets">
        <div className="table_box">
          <h2 className="mb-4">Wallets</h2>
          <Form.Group
            className="my-4 d-flex align-items-center mx-auto"
            style={{ maxWidth: "700px" }}
          >
            <Form.Control type="text" placeholder="Enter Wallet ID" />
            <Button className="ms-3 search_btn">Search</Button>
          </Form.Group>
          <Table responsive="xxl">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Wallet ID</th>
                <th>Total Active Policies</th>
                <th>Total Active Stakes (In SEEDX)</th>
                <th>Total Inactive Stakes + Reward(In SEEDX)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.totalWalletStakes.map((stakes, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{stakes.wallet}</td>
                    <td>{stakes.total_policies}</td>
                    <td>{stakes.active_stakes}</td>
                    <td>{stakes.total_reward}</td>
                    <td>
                      <Button>View History</Button>
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

export default wallets;
