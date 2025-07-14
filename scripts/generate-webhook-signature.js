const crypto = require('crypto');

/**
 * Generate webhook signature for testing
 * Usage: node scripts/generate-webhook-signature.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Get webhook secret from environment variables
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error('❌ WEBHOOK_SECRET not found in environment variables');
  console.log('Please add WEBHOOK_SECRET to your .env.local file');
  process.exit(1);
}

// Example payload
const payload = JSON.stringify({"eventType": "request"});

// Generate signature
function generateSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

const signature = generateSignature(payload, WEBHOOK_SECRET);

console.log('=== Webhook Signature Generator ===');
console.log('');
console.log('Payload:', payload);
console.log('Secret:', WEBHOOK_SECRET);
console.log('Generated Signature:', signature);
console.log('');
console.log('=== Complete cURL Command ===');
console.log('');
console.log(`curl -X POST http://localhost:3000/api/dreamnet/webhook \\
  -H "Content-Type: application/json" \\
  -H "x-signature: ${signature}" \\
  -d '${payload}'`);
console.log('');
console.log('=== Alternative with sha256= prefix ===');
console.log('');
console.log(`curl -X POST http://localhost:3000/api/dreamnet/webhook \\
  -H "Content-Type: application/json" \\
  -H "x-signature: sha256=${signature}" \\
  -d '${payload}'`);
console.log('');

// If you want to test with a different payload, you can modify this:
console.log('=== Testing with custom payload ===');
const customPayload = JSON.stringify({"eventType": "custom", "data": {"message": "test"}});
const customSignature = generateSignature(customPayload, WEBHOOK_SECRET);
console.log('');
console.log(`curl -X POST http://localhost:3000/api/dreamnet/webhook \\
  -H "Content-Type: application/json" \\
  -H "x-signature: ${customSignature}" \\
  -d '${customPayload}'`); 