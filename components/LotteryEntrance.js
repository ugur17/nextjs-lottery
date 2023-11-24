import {useWeb3Contract, useChain, useMoralis} from "react-moralis"
import {abi, contractAddresses} from "../constants"
import { useEffect, useState } from "react";
import { ethers } from "ethers"
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {

    const {isWeb3Enabled} = useMoralis();
    const {chainId: chainIdHex} = useChain();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    console.log(chainId)
    console.log(lotteryAddress);

    const [entranceFee, setEntranceFee] = useState("0");
    const [numOfPlayers, setnumOfPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const dispatch = useNotification();


    const {runContractFunction: enterLottery} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee

    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "getEntranceFee",
        params: {},
    })

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const {runContractFunction: getMostRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "getMostRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString();
        const numOfPlayersFromContract = (await getNumberOfPlayers()).toString();
        const recentWinnerFromContract = (await getMostRecentWinner());
        setEntranceFee(entranceFeeFromContract);
        setnumOfPlayers(numOfPlayersFromContract);
        setRecentWinner(recentWinnerFromContract);
    }

    let checkForWinner = async function () {
        return await getMostRecentWinner();
    }

    useEffect(() => {
        if(isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function(tx) {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
    }

    const handleNewNotification = function() {
        dispatch({
            type: "success",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR"
        })
    }

    return (
        <div>
            {lotteryAddress 
                ?   <div>
                        <button 
                            onClick={async () => {
                                await enterLottery({
                                    onSuccess: handleSuccess,
                                    onError: (error) => {console.log(error)}
                                }) 
                            }}
                        >
                            Enter Lottery
                        </button>
                        Entrance Fee:  {ethers.utils.formatUnits(entranceFee, "ether")} ETH 
                        Number of players: {numOfPlayers}
                        Recent Winner: {recentWinner}
                    </div>
                : <div> No address detected. </div>
            }
            
        </div>
    )
}