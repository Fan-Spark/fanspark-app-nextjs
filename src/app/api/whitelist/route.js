import { NextResponse } from 'next/server';

// This would normally be fetched from a database
// For this example, we'll use the provided JSON data
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  // Find all whitelist entries for this address
  const userWhitelistEntries = whitelist.whitelist.filter(
    entry => entry.address.toLowerCase() === address.toLowerCase()
  );
  
  // Format the response with all tokenIds this address is whitelisted for
  const whitelistInfo = userWhitelistEntries.map(entry => ({
    tokenId: entry.tokenId,
    amount: entry.amount
  }));
  
  return NextResponse.json({
    isWhitelisted: userWhitelistEntries.length > 0,
    tokens: whitelistInfo
  });
} 