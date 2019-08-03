import AirbnbABI from './deLoanABI'
const Web3 = require('web3')

let metamaskWeb3 = new Web3('https://testnet2.matic.network')
let account = null
let airbnbContract
let airbnbContractAddress = '0xef5a10A467A3cb77aEba4a7c7220D0dd5243338d' // Paste Contract address here

export function web3() {
    return metamaskWeb3
}

export const accountAddress = () => {
    return account
}

export async function setProvider() {
    // TODO: get injected Metamask Object and create Web3 instance
    if (window.ethereum) {
        metamaskWeb3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
        } catch (error) {
            // User denied account access...
        }
    } else if (window.web3) {
        metamaskWeb3 = new Web3(web3.currentProvider);
    }
    account = await metamaskWeb3.eth.getAccounts()
}


function getAirbnbContract() {
    // TODO: create and return contract Object
    airbnbContract = airbnbContract || new metamaskWeb3.eth.Contract(AirbnbABI.abi, airbnbContractAddress)
    return airbnbContract

}


export async function createALoan(amount) {
    // TODO: call Airbnb.rentOutproperty
    console.log(amount);
    const prop = await getAirbnbContract().methods.createALoan(amount).send({
        from: account[0]
    })
    alert('Property Posted Successfully')
}

export async function lendLoan(spaceId, amount) {
    // TODO: call Airbnb.rentSpace
    const prop = await getAirbnbContract().methods.lendALoan(spaceId, amount).send({
        from: account[0]
    })
    alert('Property Booked Successfully')
}

export async function fetchAllProperties() {
    const propertyId = await getAirbnbContract().methods.loanId().call()
    const LoanItems = []
    for (let i = 0; i < propertyId; i++) {
        const p = await airbnbContract.methods.loans(i).call()
        LoanItems.push({
            id: i,
            got_full_amount: p.got_full_amount,
            requested_amount: p.requested_amount,
            amount_recieved: p.amount_recieved,
            borrower_address: p.borrower_address,
            // price: metamaskWeb3.utils.fromWei(p.price)
        })
    }


    // Filter loans matching to my account
    let myLoans = LoanItems.filter((item) => {
        return item.borrower_address === account[0]
    });
    let notMyLoans = LoanItems.filter((item) => {
        return item.borrower_address !== account[0]
    });
    console.log('myloans: ', myLoans)
    console.log('notmyloans: ', notMyLoans)

    // For each loan check lender
    const lenderId = await getAirbnbContract().methods.lenderId().call()
    const Lenders = []
    for (let i = 0; i < lenderId; i++) {
        const p = await airbnbContract.methods.lenders(i).call()
        Lenders.push({
            id: i,
            amount: p.amount,
            loanId: p.loanId
                // price: metamaskWeb3.utils.fromWei(p.price)
        })
    }

    //  0      ,  1    
    // {'0':[{}{}],'1':[{}{}{}]}
    // let loan_lenders = {};
    // myLoans.forEach((loan, index) => {
    //     console.log(loan, index)
    //     for (let i = 0; i < Lenders.length; i++) {
    //         if (Lenders[i].loanId == loan.id) {

    //         }
    //     }
    // });

    // console.log('loan_lenders', loan_lenders)

    console.log("fetchAllProperties", LoanItems)


    return {
        myLoans,
        notMyLoans,
        // loan_lenders
    };
}