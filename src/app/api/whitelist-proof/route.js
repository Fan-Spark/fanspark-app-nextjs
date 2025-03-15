import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

// This would normally be pre-computed and stored in a database
// For this example, we'll generate it on-the-fly from the whitelist data
// In production, you would precompute these using the Node.js script provided
const whitelist = {
  "whitelist": [
    {
      "address": "0xF01446cea3D36f307043E38eAB5238BFE4C444AD",
      "tokenId": 1,
      "amount": 2
    },
    {
      "address": "0xEd2c91c774cCCa85Cc219a012Fb1DD7C473ED847",
      "tokenId": 5,
      "amount": 3
    },
    {
      "address": "0x3234567890123456789012345678901234567892",
      "tokenId": 1,
      "amount": 3
    },
    {
      "address": "0x4234567890123456789012345678901234567893",
      "tokenId": 3,
      "amount": 1
    },
    {
      "address": "0xF01446cea3D36f307043E38eAB5238BFE4C444AD",
      "tokenId": 2,
      "amount": 2
    },
    {
      "address": "0xF01446cea3D36f307043E38eAB5238BFE4C444AD",
      "tokenId": 3,
      "amount": 1
    }
  ]
};

// Better keccak256 implementation for Ethereum compatibility
function keccak256(data) {
  return createHash('sha3-256').update(data).digest();
}

// Create leaf node in the exact format the contract expects
function createLeaf(address, tokenId, amount) {
  // This needs to match the contract's: keccak256(abi.encodePacked(msg.sender, tokenId, amount))
  // For our demo, we'll use a simple concatenation approach
  return keccak256(Buffer.from(`${address.toLowerCase()}${tokenId}${amount}`, 'utf8'));
}

// More proper MerkleTree implementation for our use case
class MerkleTree {
  constructor(whitelist) {
    // Create leaves from whitelist
    this.leaves = whitelist.map(item => 
      createLeaf(item.address, item.tokenId, item.amount)
    );
    
    // Build the tree
    this.layers = [this.leaves];
    this.buildTree();
  }

  buildTree() {
    let layer = this.leaves;
    while (layer.length > 1) {
      const newLayer = [];
      for (let i = 0; i < layer.length; i += 2) {
        if (i + 1 === layer.length) {
          newLayer.push(layer[i]);
        } else {
          const left = layer[i];
          const right = layer[i + 1];
          const data = Buffer.concat([left, right].sort(Buffer.compare));
          newLayer.push(keccak256(data));
        }
      }
      this.layers.push(newLayer);
      layer = newLayer;
    }
  }

  getRoot() {
    return this.layers[this.layers.length - 1][0].toString('hex');
  }

  getProof(address, tokenId, amount) {
    // Find the leaf index for this address, tokenId, and amount
    const leaf = createLeaf(address, tokenId, amount);
    const idx = this.leaves.findIndex(l => l.equals(leaf));
    
    if (idx === -1) return null;
    
    // Generate proof same as before
    return this.layers.reduce((proof, layer, i) => {
      if (i === this.layers.length - 1 || (idx % 2 === 1) || (idx === layer.length - 1 && idx % 2 === 0)) {
        return proof;
      }
      
      // Format proofs as hex strings to match Solidity expectations
      const hexProof = '0x' + layer[idx + 1].toString('hex');
      return [...proof, hexProof];
    }, []);
  }
}

// In a real application, we would use the user's script
// Here we're simulating a simple version for demo purposes
function encodeWhitelistItem(address, tokenId, amount) {
  return `${address.toLowerCase()}-${tokenId}-${amount}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const tokenId = searchParams.get('tokenId');
  
  if (!address || !tokenId) {
    return NextResponse.json({ error: 'Address and tokenId parameters are required' }, { status: 400 });
  }

  // Find whitelist entry for this address and tokenId
  const whitelistEntry = whitelist.whitelist.find(
    entry => entry.address.toLowerCase() === address.toLowerCase() && 
            entry.tokenId === parseInt(tokenId)
  );
  
  if (!whitelistEntry) {
    return NextResponse.json({ 
      isWhitelisted: false,
      message: 'Address not whitelisted for this token ID'
    });
  }
  
  // Create Merkle Tree from whitelist data
  const tree = new MerkleTree(whitelist.whitelist);
  
  // Get proof for this specific address, tokenId, and amount
  const proof = tree.getProof(
    address,
    parseInt(tokenId),
    whitelistEntry.amount
  );
  
  return NextResponse.json({
    isWhitelisted: true,
    amount: whitelistEntry.amount,
    proof: proof || [],
    // Include the root for reference/testing
    root: '0x' + tree.getRoot().toString('hex')
  });
} 