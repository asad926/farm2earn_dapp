import Web3 from "web3";

const getWallet = () =>
  new Promise( async(resolve, reject) => { 
    console.log("event promise");

      if (window.ethereum) {
        console.log("window.ethereum");
        const web3 = new Web3(window.ethereum);
        try {
          let address = await window.ethereum.request({ method: 'eth_requestAccounts' });
          resolve({web3:web3,account:address});
 
 
        } catch (error) { 
          reject(error);
        }
      }
      else if (window.web3) {
        console.log("window.web3");
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
  });

export default getWallet;