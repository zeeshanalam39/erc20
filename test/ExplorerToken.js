const { expect } = require('chai');
const hre = require('hardhat');

describe('ExplorerToken contract', function () {
  let Token;
  let explorerToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 10000;
  let initialSupply = 500;

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

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      // Transfer 50 tokens from owner to addr1
      await explorerToken.transfer(addr1.address, 50);
      const addr1Balance = await explorerToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await explorerToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await explorerToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);

      // expect(await explorerToken.balanceOf(addr1.address)).to.equal(0);

    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await explorerToken.balanceOf(owner.address);
      await expect(
        explorerToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');

      // Owner balance shouldn't have changed.
      expect(await explorerToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it('Should update balances after transfers', async function () {
      const initialOwnerBalance = await explorerToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await explorerToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await explorerToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await explorerToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await explorerToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await explorerToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
