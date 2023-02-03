/* eslint-disable no-process-exit */
const { getWeth, AMOUNT } = require("../scripts/getWeth")
const { ethers } = require("hardhat")

async function main() {
    await getWeth()
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    //Lending Pool Addresses Provider = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5

    const lendingPool = await getLendingPool(deployer)
    console.log(`LendingPool address ${lendingPool.address}`)

    // Deposit
    const wethTokenAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    // Approve
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing...")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer.address, 0)
    console.log("Deposited! ✨")

    //Borrow
    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
        lendingPool,
        deployer.address
    )

    const daiPrice = await getDAIPrice()
    

    // Borrow Time
}

async function getDAIPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "contracts/interfaces/AggregatorV3Interface.sol:AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)
    return price
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH }
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
}

async function approveErc20(erc20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved! ✨")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
