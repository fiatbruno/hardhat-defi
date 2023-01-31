const { ethers, getNamedAccounts } = require("hardhat")
const test = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    // const { deployer } = await getNamedAccounts()
    //0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer.address)
    console.log(`Got ${wethBalance.toString()} WETH`)
}

module.exports = { getWeth, AMOUNT}
