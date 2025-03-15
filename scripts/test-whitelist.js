// A simple script to test whitelist minting
// Usage: node scripts/test-whitelist.js <address> <tokenId>

const { ethers } = require('ethers');
const fs = require('fs');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

async function main() {
  const address = process.argv[2];
  const tokenId = process.argv[3];
  
  if (!address || !tokenId) {
    console.error('Please provide an address and tokenId: node test-whitelist.js 0x123... 1');
    process.exit(1);
  }
  
  // Load whitelist data
  const whitelist = JSON.parse(fs.readFileSync('./whitelist.json', 'utf8'));
  
  // Find entry for this address and tokenId
  const entry = whitelist.whitelist.find(e => 
    e.address.toLowerCase() === address.toLowerCase() && 
    e.tokenId === parseInt(tokenId)
  );
  
  if (!entry) {
    console.log(`Address ${address} is not whitelisted for token ID ${tokenId}`);
    process.exit(0);
  }
  
  // Create Merkle Tree
  const leaves = whitelist.whitelist.map(item => 
    ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256', 'uint256'],
        [item.address, item.tokenId, item.amount]
      )
    )
  );
  
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getHexRoot();
  
  // Create leaf for the input address
  const leaf = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'uint256', 'uint256'],
      [address, parseInt(tokenId), entry.amount]
    )
  );
  
  const proof = tree.getHexProof(leaf);
  
  console.log('\nWhitelist Proof Information:');
  console.log('---------------------------');
  console.log('Address:', address);
  console.log('Token ID:', tokenId);
  console.log('Allocation:', entry.amount);
  console.log('\nMerkle Root:', root);
  console.log('\nProof:', proof);
  
  // Verify the proof works
  const isValid = tree.verify(proof, leaf, root);
  console.log('\nProof Valid:', isValid);
  
  console.log('\n---------------------------');
  console.log('To use in contract:');
  console.log(`Set merkleRoot = "${root}"`);
  console.log(`Call mintWhitelist(${tokenId}, ${entry.amount}, [${proof.map(p => `"${p}"`).join(', ')}])`);
}

main().catch(console.error); 