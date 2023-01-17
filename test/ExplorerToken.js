const { expect } = require('chai');
const hre = require('hardhat');

describe('ExplorerToken contract', function () {
  // global vars
  let Token;
  let explorerToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let initialSupply = 50;

  beforeEach(async function () {
    Token = await ethers.getContractFactory('ExplorerToken');
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    explorerToken = await Token.deploy(tokenCap, initialSupply);
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await explorerToken.owner()).to.equal(owner.address);
    });

    it('Should assign the total supply of tokens to the owner', async function () {
      const ownerBalance = await explorerToken.balanceOf(owner.address);
      expect(await explorerToken.totalSupply()).to.equal(ownerBalance);
    });

    it('Should set the max capped supply to the argument provided during deployment', async function () {
      const cap = await explorerToken.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });
  });
});
