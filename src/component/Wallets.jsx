import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
class wallets extends Component {
  state = {};
  render() {
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
                <th>Total Active Stakes (In DIX)</th>
                <th>Total Inactive Stakes + Reward(In DIX)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>5000</td>
                <td>0</td>
                <td>
                  <Button>View History</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>5000</td>
                <td>0</td>
                <td>
                  <Button>View History</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>5000</td>
                <td>0</td>
                <td>
                  <Button>View History</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>5000</td>
                <td>0</td>
                <td>
                  <Button>View History</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>5000</td>
                <td>0</td>
                <td>
                  <Button>View History</Button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Addr1q.......Ydsasa</td>
                <td>1</td>
                <td>5000</td>
                <td>0</td>
                <td>
                  <Button>View History</Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default wallets;
