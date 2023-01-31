/* eslint-disable no-process-exit */
const { getWeth } = require("../scripts/getWeth")
const { ethers } = require("hardhat")

async function main() {
    await getWeth()
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    
    //Lending Pool Address Provider0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5

}

async function getLendingPool(){
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
