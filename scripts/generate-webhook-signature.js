const crypto = require('crypto');

/**
 * Generate webhook signature for testing
 * Usage: node scripts/generate-webhook-signature.js
 */

// Example webhook secret (you should use your actual secret from .env)
const WEBHOOK_SECRET = '0e94f3c465f0238d4756f73c001ef60fca3437d062fbcc5054dea113a8993c32';

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