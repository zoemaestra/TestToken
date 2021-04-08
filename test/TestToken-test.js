const { expect } = require("chai");

describe("TestToken", async function() {
  //Tests for TestToken contract
  let owner, user, user1, attacker;

  before(async function() {
    /*const accounts = await ethers.getSigners();
    owner = accounts[0];
    user = accounts[1];
    delegate = accounts[2];
    attacker = accounts[2];*/
    [owner, user, delegate, attacker] = await ethers.getSigners();
  })

  it("Deploy test", async function() {
    //Test deploying token
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy("1000");
    
    await testToken.deployed();
    expect(await testToken.balanceOf(owner.address)).to.equal("1000");
  });

  it("Mint test", async function() {
    //Test mint function
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy("1000");

    await testToken.deployed();

    await testToken.mint("1");

    expect(await testToken.totalSupply()).to.equal("1001");
  });

  it("Transfer test", async function() {
    //Test transfering from one account to another
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy("1000");

    await testToken.deployed();

    await testToken.transfer(user.address, "1");

    expect(await testToken.balanceOf(user.address)).to.equal("1");
    expect(await testToken.balanceOf(owner.address)).to.equal("999");
  });

  it("Delegation authorization test", async function() {
    //Test transfering from one account to another using an authorized delegate
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy("1000");

    await testToken.deployed();

    await testToken.approve(delegate.address, "10");

    expect(await testToken.allowance(owner.address,delegate.address)).to.equal("10");
  });

  it("Delegation transfer test", async function() {
    //Test transfering from one account to another using an authorized delegate
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy("1000");

    await testToken.deployed();

    await testToken.approve(owner.address, "10");

    await testToken.transferFrom(owner.address,user.address,10)

    expect(await testToken.balanceOf(owner.address)).to.equal("990");
    expect(await testToken.balanceOf(user.address)).to.equal("10");
  });
});
