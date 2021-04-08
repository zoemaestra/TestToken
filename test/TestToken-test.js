const { expect } = require("chai");

describe("TestToken", async function() {
  let owner, user, user1, attacker;

  before(async function() {
    /*const accounts = await ethers.getSigners();
    owner = accounts[0];
    user = accounts[1];
    user1 = accounts[2];
    attacker = accounts[2];*/
    [owner, user, user1, attacker] = await ethers.getSigners();
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

    await testToken.mint(1);

    expect(await testToken.totalSupply()).to.equal("1001");
  });

  it("Transfer test", async function() {
    //Test transfering from one account to another
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy("1000");

    await testToken.deployed();

    await testToken.transfer(user1.address, 1);

    expect(await testToken.balanceOf(user1.address)).to.equal("1");
    expect(await testToken.balanceOf(owner.address)).to.equal("999");
  });
});
