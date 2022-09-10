import Web3 from "web3";

const getWallet = () =>
    new Promise(async (resolve, reject) =>
    {

        if (window.ethereum)
        {
            const web3 = new Web3(window.ethereum);
            try
            {
                let address = await window.ethereum.request({ method: 'eth_requestAccounts' });
                resolve({ web3: web3, account: address });
                let polygonChainInfo = getChainsInfo();
                    await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [polygonChainInfo] });

            } catch (error)
            {
                reject(error);
            }
        }
        else if (window.web3)
        {
            const web3 = window.web3;
            resolve(web3);
        }
    });

const getChainsInfo = () =>
{
    if (window.location.host.indexOf("localhost") !== -1)
    {
        return {
            chainId: "0x13881", //'80001',
            chainName: 'Polygon Testnet Mumbai',
            nativeCurrency: {
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com']
        }
    } else
    {
        return {
            chainId: "0x89", // '137',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com']
        }
    }
}

export default getWallet;