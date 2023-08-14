import React, {useEffect, useState} from "react"
import {ethers} from "ethers"
// import {createContext} from "react"

import {contractAbi, contractAddress} from "../utils/constants"
export const TransactionContext = React.createContext();
const {ethereum}= window;


export const TransactionProvider=({children})=>{
    // let transactionContract;
    const [formData,setformData]=useState({addressTo:"", amount:"",keyword:"", message:""});
    const [currentAccount,setCurrentAccount]=useState("");
    const [isLoading,setIsLoading]=useState(false);
    const [transactionCount,setTransactionCount]=useState(localStorage.getItem("transactionCount"));
    const [transactions,setTransactions]=useState([]);


    const createEthereumContract = async ()=>{
        const provider= new ethers.BrowserProvider(ethereum)
        const signer= await provider.getSigner();
         const transactionContract= new ethers.Contract(contractAddress,contractAbi,signer)
        return transactionContract;
    }
    const handleChange= (e,name)=>{
        setformData((prevState)=>({...prevState,[name]: e.target.value }))

    }

    const getAllTransactions = async ()=>{
        try {
            if(ethereum){
                // try {
                    
                //     // const transactionContract= await createEthereumContract();
                //     // const availableTransactions= await transactionContract.getAllTransactions();
                //     // console.log(availableTransactions)
                // } catch (error) {
                //     console.log(error)
                // }
                const transactionContract= await createEthereumContract();
                const availableTransactions= await transactionContract.getAllTransactions();
                const tx_count= await transactionContract.getTransactionCount();
                console.log(`tx_count given by:${tx_count}`)
                // const tx_response =await transactionContract.getAllTransactions()
                // try {
                //     const tx_stamp= new Date(ethers.toNumber(tx_response[3].timestamp)*1000).toString()
                //     console.log(tx_stamp)
                // } catch (error) {
                //     console.log(error)
                // }

                const structuredTransactions= availableTransactions.map((transaction)=>({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timeStamp:new Date(ethers.toNumber(transaction.timestamp)*1000).toLocaleString(),
                    message:transaction.message,
                    keyword:transaction.keyword,
                    amount:parseInt(ethers.toBeHex(transaction.amount))/(10**18),
                }))
                console.log("---------------------------->")
                console.log(structuredTransactions)
                setTransactions(structuredTransactions)
            }
            else{
                console.log(error)
            }
            
        } catch (error) {
            
        }

    }
    const checkIfWalletIsConnect = async ()=>{
        if(!ethereum) return  alert("please install metamask")
        const accounts= await ethereum.request({method:"eth_accounts"})
        if(accounts.length){
            setCurrentAccount(accounts[0]);
        //    await  getAllTransactions();

        }
        else {
            console.log("no accounts found")
        }

    }

    const checkIfTransactionsExists=async ()=>{
        try {
            if(ethereum){
                const transactionContract= await createEthereumContract();
                // console.log(transactionContract)
            //  await createEthereumContract();


                const currentTransactionCount= await transactionContract.getTransactionCount();
                window.localStorage.setItem("transactionCount",currentTransactionCount)
                await getAllTransactions()
            }
            
        } catch (error) {
            console.log(error)
            throw new Error("no ethreum object")
        }

    }
    const connectWallet= async ()=>{
        try {
            if(!ethereum) return alert("please install metamask");
            const accounts = await ethereum.request({method:"eth_requestAccounts",})
            console.log(accounts)
            setCurrentAccount(accounts[0]);
            await getAllTransactions();
            // console.log("--------------------------------->")
            // console.log(transactions)
            window.location.reload();
        } catch (error) {
            console.log(error)
            throw new Error("no eth object")
        }

    }
    const sendTransaction= async ()=>{
        if(ethereum)
      {  
        const {addressTo, amount, keyword, message}= formData;
        const transactionContract= await createEthereumContract();
        // console.log(transactionContract)
        let parsedAmount= ethers.parseEther(amount);
        parsedAmount=ethers.toBeHex(parsedAmount);
        setIsLoading(true)

        await ethereum.request({
            method:"eth_sendTransaction",
            params:[{
                from:currentAccount,
                to:addressTo,
                gas:"0x5208",
                data:"",
                value:parsedAmount,
            }]
        })
            
        try {
            const transactionHash= await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword)
            console.log("added to blockchain----->")


            console.log(`loading-${transactionHash.hash}`)
            await transactionHash.wait()
            console.log(`sucess - ${transactionHash.hash}`)
            // await getAllTransactions()
            setIsLoading(false);
            // const tx_response =await transactionContract.getAllTransactions()
            // console.log(tx_response[3].timestamp)
            // console.log(transactions)
            
        } catch (error) {
            console.log(error)
            // throw new Error("not able to call function")
        }


        const transactionCount=await transactionContract.getTransactionCount();
        setTransactionCount(ethers.toNumber(transactionCount))
        // console.log(ethers.toNumber(transactionCount))
        window.location.reload();
    }
    else{
        console.log("no ethereum object")
    }
    }

useEffect(()=>{
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
},[transactionCount])

    return (
        <TransactionContext.Provider value={{
            transactionCount,
            connectWallet,
            transactions,
            currentAccount,
            isLoading,
            sendTransaction,
            handleChange,
            formData,
        }}>
            {children}
        </TransactionContext.Provider>
    )
};