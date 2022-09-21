// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;


// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)
/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}
//File: "@openzeppelin/contracts/access/Ownable.sol";
// OpenZeppelin Contracts (last updated v4.7.0) (access/Ownable.sol)

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
    abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}
/**
* @notice Stakeable is a contract who is ment to be inherited by other contract that wants Staking capabilities
*/
contract StakeSEEDX is Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private poolId;

    IERC20 private SeedX;
    IERC20 private USDT; 
    /**
    * @notice Constructor since this contract is not ment to be used without inheritance
    * push once to stakeholders for it to work proplerly
     */
    constructor(address seedxContract, address usdtContract) {

        SeedX = IERC20(seedxContract);
        USDT = IERC20(usdtContract);

        poolId.increment();
        Pools[poolId.current()] = StakePool({
            lockTime : 100,
            rewardRate : 1000
        });
        poolId.increment();
        Pools[poolId.current()] = StakePool({
            lockTime : 150,
            rewardRate : 2000
        });
        poolId.increment();
        Pools[poolId.current()] = StakePool({
            lockTime : 200,
            rewardRate : 3000
        });
        // This push is needed so we avoid index 0 causing bug of index-1
        stakeHolders.push();
    }
    /**
     * @notice
     * A stake pool struct is used to represent the way we store stake pools, 
     * A Stake Pool will contain the total lock period and reward rate,
     * It stores the 3 different pools with different lock time and reward rate,
     */
    struct StakePool{
        uint256 lockTime;
        uint256 rewardRate;
    }
    /**
     * @notice
     * A Stake struct is used to represent the way we store the user stakes, 
     * A Stake will contain the total lock period, the amount staked and a timestamp, 
     * Since which is when the stake was made
     */
    struct Stake{
        address userWallet;
        uint256 amount;
        uint256 stakeAt;
        uint256 endAt;
        uint256 totalReward;
        uint256 lastClaimedAt;
        uint256 poolId;
        bool activeStake;
    }
     /**
    * @notice 
    * stakes is used to keep track of the INDEX for the stakers in the stakes array
     */
    mapping(uint256 => StakePool) public Pools;
    mapping(address => mapping(uint256 => Stake)) internal Stakes;
    mapping(address => Counters.Counter) public userStakes;
    /**
    * @notice Staked event is triggered whenever a user stakes tokens, address is indexed to make it filterable
     */
     event Staked(address indexed user, uint256 amount, uint256 poolId, uint256 stakedAt);
     event UnStaked(address indexed user, uint256 amount, uint256 userStake, uint256 unstakedAt);
     event ClaimReward(address indexed user, uint256 amount, uint256 userStake, uint256 claimedAt);

    /**
     * @notice
      rewardPerHour is 1000 because it is used to represent 0.001, since we only use integer numbers
      This will give users 0.1% reward for each staked token / H
     */
    uint256 private rewardLockTime = 365 days;
    uint256 public totalStaked = 0;
    uint256 public totalUnstaked = 0;
    uint256 public totalRewardCollected = 0;
    address[] public stakeHolders;

    /**
    * @notice _addStakeholder takes care of adding a stakeholder to the stakeholders array
     */
    function _addStakeholder(address staker) internal {
        // Push a empty item to the Array to make space for our new stakeholder
        stakeHolders.push();
        // Calculate the index of the last item in the array by Len-1
        uint256 userIndex = stakeHolders.length - 1;
        // Assign the address to the new index
        stakeHolders[userIndex] = staker;
    }

    /**
    * @notice
    * _Stake is used to make a stake for an sender. It will remove the amount staked from the stakers account and place those tokens inside a stake container
    * StakeID 
    */
    function stake(uint256 _amount, uint256 _poolId) payable public{
        require(_poolId>0 && _poolId<=3, "Error: pool id must be between 1 - 3");
        // Simple check so that user pay the 1 matic fee for staking
        require(msg.value == 1 ether, "You have to pay the 1 matic fee for staking");
        // Simple check so that user does not stake 0 
        require(_amount > 0, "you cannot stake 0 seedx tokens.");
        // Mappings in solidity creates all values, but empty, so we can just check the address
        require(SeedX.transferFrom(msg.sender, address(this), _amount),"Error: can't staked successfully.");
        // block.timestamp = timestamp of the current block in seconds since the epoch
        uint256 timestamp = block.timestamp;
        // See if the staker already has a staked index or if its the first time
        if(userStakes[msg.sender].current() == 0){
            // This stakeholder stakes for the first time
            // We need to add him to the stakeHolders and also map it into the Index of the stakes
            // The index returned will be the index of the stakeholder in the stakeholders array
            _addStakeholder(msg.sender);
        }
         userStakes[msg.sender].increment();
        // Use the index to push a new Stake
        totalStaked = totalStaked+_amount;
        // push a newly created Stake with the current block timestamp.
        Stakes[msg.sender][userStakes[msg.sender].current()] = Stake({
         userWallet : msg.sender,
         amount : _amount,
         stakeAt : timestamp,
         endAt : Pools[_poolId].lockTime,
         totalReward : 0 ,
         lastClaimedAt : timestamp,
         poolId : _poolId,
         activeStake : true
    });
        // Emit an event that the stake has occured
        emit Staked(msg.sender, _amount, _poolId ,timestamp);
    }

    /**
      * @notice
      * calculateStakeReward is used to calculate how much a user should be rewarded for their stakes
      * and the duration the stake has been active
     */
      function calculateStakeReward(Stake memory _current_stake) private view returns(uint256){
          // First calculate how long the stake has been active
          // Use current seconds since epoch - the seconds since epoch the stake was made
          // The output will be duration in SECONDS ,
          // We will reward the user 0.1% per Hour So thats 0.1% per 3600 seconds
          // the alghoritm is  seconds = block.timestamp - stake seconds (block.timestap - _stake.since)
          // hours = Seconds / 3600 (seconds /3600) 3600 is an variable in Solidity names hours
          // we then multiply each token by the hours staked , then divide by the rewardPerHour rate 
          uint256 diffTime = block.timestamp - _current_stake.lastClaimedAt;
          uint256 rewardInterval = 365 days;
          uint256 rewardAPY = Pools[_current_stake.poolId].rewardRate;
          uint rewardAmount = (((_current_stake.amount * rewardAPY) * diffTime)/rewardInterval)/1e9;
          return rewardAmount;
      }

    /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function unstake(uint256 _amount, uint256 _index) payable public returns(bool){
        require(msg.value == 1 ether, "You have to pay the 1 matic fee for unstaking");
         // Grab user_index which is the index to use to grab the Stake[]
        Stake memory currentStake = Stakes[msg.sender][_index];
        uint256 totalStakedTime = block.timestamp - currentStake.stakeAt;
        require(totalStakedTime >= currentStake.endAt,"Error: you can unstake before the locktime of your pool.");
        require(currentStake.amount >= _amount, "Staking: Cannot withdraw more than you have staked");
         // Calculate available Reward first before we start modifying data
        uint256 rewardEarned = calculateStakeReward(currentStake);
         // transfer earned reward before unstaking
        require(USDT.transfer(msg.sender, rewardEarned),"Error: reward is not transfered.");
        totalRewardCollected = totalRewardCollected+rewardEarned;
         // transfer staked seedx ammout to user wallet for unstaking 
        require(SeedX.transfer(msg.sender, _amount),"Error: unstaking failed.");
         // Remove by subtracting the seedx unstaked 
         currentStake.amount = currentStake.amount - _amount;
         totalUnstaked = totalUnstaked+_amount;
         // If stake is empty, 0, then remove it from the array of stakes
         if(currentStake.amount == 0){
             delete Stakes[msg.sender][_index];
         }else {// If not empty then replace the value of it
             Stakes[msg.sender][_index].amount = currentStake.amount;
             // Reset timer of stake
            Stakes[msg.sender][_index].stakeAt = block.timestamp; 
            Stakes[msg.sender][_index].lastClaimedAt = block.timestamp;  
         }

         emit UnStaked(msg.sender, _amount, _index ,block.timestamp);
         return true;
     }

     /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function claimReward(uint256 _index) public returns(bool){
         // Grab user_index which is the index to use to grab the Stake[]
        Stake memory currentStake = Stakes[msg.sender][_index];
        uint256 totalClaimTime = block.timestamp - currentStake.lastClaimedAt;
        require(totalClaimTime >= rewardLockTime,"Error: you can't claim reward before locktime");
         // Calculate available Reward first before we start modifying data
        uint256 rewardEarned = calculateStakeReward(currentStake);
         // transfer earned reward before unstaking
        require(USDT.transfer(msg.sender, rewardEarned),"Error: reward is not transferred.");
        totalRewardCollected = totalRewardCollected+rewardEarned;
         // Remove by subtracting the seedx unstaked 
            Stakes[msg.sender][_index].totalReward = Stakes[msg.sender][_index].totalReward + rewardEarned;
             // Reset timer of stake
            Stakes[msg.sender][_index].lastClaimedAt = block.timestamp;  

         emit ClaimReward(msg.sender, rewardEarned, _index ,block.timestamp);
         return true;
     }

     /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function rewardInfo(address _staker,uint256 _index) public view returns(uint256){
         // Grab user_index which is the index to use to grab the Stake[]
        Stake memory currentStake = Stakes[_staker][_index];
         // Calculate available Reward first before we start modifying data
        uint256 rewardEarned = calculateStakeReward(currentStake);
         
         return rewardEarned;
     }
     /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function transferFee(address payable _wallet) onlyOwner public returns(bool){
         // Grab user_index which is the index to use to grab the Stake[]
        bool sent = _wallet.send(address(this).balance);
        require(sent, "Failed to send Matic");
         return true;
     }

     /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function updateStakePool(uint256 _poolId, uint256 _newLockTime, uint256 _newRewardRate) onlyOwner public returns(bool){
         require(_poolId > 0 && _poolId <=3,"pool id much be greater then 0 and less then 4");
         // Grab user_index which is the index to use to grab the Stake[]
         StakePool memory _newPool = StakePool({
             lockTime : _newLockTime,
            rewardRate : _newRewardRate
         });
         Pools[_poolId] = _newPool;
         return true;
     }
      /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function updateRewardLockTime(uint256 _newRewardLockTime) onlyOwner public returns(bool){
         // Grab user_index which is the index to use to grab the Stake[]
        rewardLockTime = _newRewardLockTime;
         return true;
     }
  /**
     * @notice
     * withdrawStake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function withdrawUSDT(uint256 _usdtAmount) onlyOwner public returns(bool){
         uint256 contractUsdtBalance = USDT.balanceOf(address(this));
         require(_usdtAmount <= contractUsdtBalance,"you can't withdraw usdt more then avaiable in contract");
         
         USDT.transfer(msg.sender,_usdtAmount);
         return true;
     }

     /**
     * @notice
     * hasStake is used to check if a account has stakes and the total amount along with all the seperate stakes
     */
    function hasStake(address _staker) public view returns(Stake[] memory){
        // Keep a summary in memory since we need to calculate this
        Stake[] memory userTotalStakes = new Stake[](userStakes[_staker].current());
        Stake memory _userStake;
        // Itterate all stakes and grab amount of stakes
        for (uint256 s = 1; s <= userStakes[_staker].current(); s++){
             _userStake = Stakes[_staker][s];
           userTotalStakes[s-1] = _userStake;
       }
       
        return userTotalStakes;
    }

    receive() external payable {}

    fallback() external payable {}
}
