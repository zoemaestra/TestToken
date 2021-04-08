"use strict"
const { expect } = require('chai');

describe('TestToken', async function () {
    //Tests for TestToken contract
    let owner, user, delegate, attacker, contract;

    before(async function () {
        // const accounts = await ethers.getSigners();
        // owner = accounts[0];
        // user = accounts[1];
        // delegate = accounts[2];
        // attacker = accounts[2];
        [owner, user, delegate, attacker] = await ethers.getSigners();
    });

    beforeEach(async function () {
        const TestToken = await ethers.getContractFactory('TestToken');
        contract = await TestToken.deploy('1000');
        await contract.deployed();
    });

    it('Deploy test', async function () {
        //Test deploying token
        expect(await contract.balanceOf(owner.address)).to.equal('1000');
    });

    it('Mint test', async function () {
        //Test mint function
        await contract.mint('1');
        expect(await contract.totalSupply()).to.equal('1001');
    });

    it('Attacker should not be able to mint', async function () {
        await expect(contract.connect(attacker).mint('1000')).to.be.revertedWith('');
    });

    it('Transfer test', async function () {
        //Test transfering from one account to another
        await contract.transfer(user.address, '1');
        expect(await contract.balanceOf(user.address)).to.equal('1');
        expect(await contract.balanceOf(owner.address)).to.equal('999');
    });

    it('Delegation authorization test', async function () {
        //Test transfering from one account to another using an authorized delegate
        await contract.approve(delegate.address, '10');
        expect(await contract.allowance(owner.address, delegate.address)).to.equal('10');
    });

    it('Delegation transfer test', async function () {
        //Test transfering from one account to another using an authorized delegate
        await contract.approve(owner.address, '10');
        await contract.transferFrom(owner.address, user.address, 10);
        expect(await contract.balanceOf(owner.address)).to.equal('990');
        expect(await contract.balanceOf(user.address)).to.equal('10');
    });
});
