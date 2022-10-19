import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { IoSpeedometer } from "react-icons/io5";
class dashboard extends Component {
  state = {};
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
            <span className="value">25</span>
          </div>
          <div className="state">
            <p>Total Staked Amount</p>
            <span className="value">229483 DIX</span>
          </div>
          <div className="state">
            <p>Total Unstaked Amount</p>
            <span className="value">0 DIX</span>
          </div>
          <div className="state">
            <p>Total Unstaked Reward</p>
            <span className="value">0 DIX</span>
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
                <th>WalletStake ID</th>
                <th>Staked Amount (In DIX)</th>
                <th>Total Rewards (In DIX)</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>44</td>
                <td>60000</td>
                <td>146</td>
                <td>2/9/2022</td>
                <td>2/10/2022</td>
                <td>
                  <Button>View Transaction</Button>
                </td>
                <td>
                  <Button>Unstake</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>44</td>
                <td>60000</td>
                <td>146</td>
                <td>2/9/2022</td>
                <td>2/10/2022</td>
                <td>
                  <Button>View Transaction</Button>
                </td>
                <td>
                  <Button>Unstake</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>44</td>
                <td>60000</td>
                <td>146</td>
                <td>2/9/2022</td>
                <td>2/10/2022</td>
                <td>
                  <Button>View Transaction</Button>
                </td>
                <td>
                  <Button>Unstake</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>44</td>
                <td>60000</td>
                <td>146</td>
                <td>2/9/2022</td>
                <td>2/10/2022</td>
                <td>
                  <Button>View Transaction</Button>
                </td>
                <td>
                  <Button>Unstake</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>44</td>
                <td>60000</td>
                <td>146</td>
                <td>2/9/2022</td>
                <td>2/10/2022</td>
                <td>
                  <Button>View Transaction</Button>
                </td>
                <td>
                  <Button>Unstake</Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default dashboard;
