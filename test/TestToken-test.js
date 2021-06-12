"use strict"
const { expect } = require('chai');
const { parseEther } = ethers.utils;

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
        contract = await TestToken.deploy(parseEther('100'));
        await contract.deployed();
        console.log(contract.address);
    });

    it('Deploy test', async function () {
        //Test deploying token
        expect(await contract.balanceOf(owner.address)).to.equal(parseEther('100'));
    });

    it('Mint test', async function () {
        //Test mint function
        await contract.mint(parseEther('20'));
        expect(await contract.totalSupply()).to.equal(parseEther('120'));
    });

    it('Attacker should not be able to mint', async function () {
        await expect(contract.connect(attacker).mint('1000')).to.be.revertedWith('');
    });

    it('Transfer test', async function () {
        //Test transfering from one account to another
        await contract.transfer(user.address, parseEther('20'));
        expect(await contract.balanceOf(user.address)).to.equal(parseEther('19'));
    });

    it('Delegation authorization test', async function () {
        //Test transfering from one account to another using an authorized delegate
        await contract.approve(delegate.address, parseEther('20'));
        expect(await contract.allowance(owner.address, delegate.address)).to.equal(parseEther('20'));
    });

    it('Delegation transfer test', async function () {
        //Test transfering from one account to another using an authorized delegate
        await contract.approve(owner.address, parseEther('20'));

        await contract.transferFrom(owner.address, user.address, parseEther('20'));

        expect(await contract.balanceOf(owner.address)).to.equal(parseEther('80'));
        expect(await contract.balanceOf(user.address)).to.equal(parseEther('19'));
    });

    it('Randomness test', async function () {
        //Test mint function
        const randint = await contract.rand(20);
        console.log(randint.toString());
        expect(randint).to.be.lt(ethers.BigNumber.from("20"));
        expect(randint).to.be.gt(ethers.BigNumber.from("0"));

    });

});
