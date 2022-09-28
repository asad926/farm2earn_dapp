import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import stakingContractAbi from "../contracts/abi/staking_contract_abi.json";
import getWallet from "./wallet_connect";
import Col from "react-bootstrap/Col";

class History extends Component
{
    state = {
        stakedAmount: "",
        APY: "",
        Period: "",
        dailyReward: "",
        remainTime: "",
        transaction: "",
        updateInterval: [],
        isSetInterval: false
    }
    
    componentDidMount = async () =>
    { 
        await this.loadStakedData();
    }

    loadStakedData = async () =>
    {

        let { web3, account } = await getWallet();

        let stakeContract = new web3.eth.Contract(
            stakingContractAbi.abi,
            stakingContractAbi.address
        ); 
        let {stakes,stakeId} = this.props.stakeData;
        this.setState({
            stakedAmount: web3.utils.fromWei(web3.utils.toBN(stakes.amount).toString(), "ether"),
            stakeId:stakeId
        })
        let pool = await stakeContract.methods.Pools(stakes.poolId).call();
        let rewardEarned = await stakeContract.methods.rewardInfo(account[0], stakeId).call();
        let timePassed = Date.now() / 1000 - parseInt(stakes.stakeAt);
        let totalTime = parseInt(stakes.endAt);
        this.setState({
            APY: pool.rewardRate,
            Period: (pool.lockTime / 86400 / 30.417).toFixed(0),
            remainTime: ((totalTime - timePassed) / 86400).toFixed(0),
            dailyReward: web3.utils.fromWei(web3.utils.toBN(rewardEarned).toString(), "mwei")
        })
        
        this.clearUpdateInterval();
        let updateTimer;
         if(!this.state.isSetInterval){
         updateTimer = setInterval(() =>
        {
        let timeDiff = (Date.now() / 1000 - parseInt(stakes.lastClaimedAt))/86400;
        let rewardEarned = (parseFloat(this.state.stakedAmount)*parseFloat(this.state.APY)*timeDiff)/365;
        this.setState({dailyReward:rewardEarned.toFixed(4)})
        }, 1000);
        this.setState({isSetInterval: true});
        this.state.updateInterval.push(updateTimer);
        this.setState({updateInterval:this.state.updateInterval});
         }
    };

    clearUpdateInterval = ()=>{
        for(let id of this.state.updateInterval) {
            clearInterval(id)
        };
        this.setState({updateInterval:[],isSetInterval: false});
    }

    render()
    {
        return (

            <Col xs={12} lg={4} >
            <div className="staking_box mx-auto">
                <p>Staked Amount: {this.state.stakedAmount} SEEDX</p>
                <p>APY: {this.state.APY}%</p>
                <p>Staking Period: {this.state.Period} Months</p>
                <p>Reward Earned: {this.state.dailyReward} USDT </p>
                <p>Days Left: {this.state.remainTime} Days</p>
                <Button onClick={this.clearUpdateInterval} className="form-control" variant="outline-success">
                    Transaction
                </Button>
            </div>
            </Col>
            
            

        );
    }
}

export default History;