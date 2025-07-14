#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Environment Variables Setup');
console.log('==============================\n');

const envPath = path.join(__dirname, '..', '.env.local');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('This script will not overwrite existing files.');
  console.log('Please manually add any missing variables to your .env.local file.\n');
  process.exit(0);
}

// Template for .env.local
const envTemplate = `# Environment Variables for FanSpark Reward Crate Minter
# Copy this file to .env.local and fill in your actual values

# ===== REQUIRED VARIABLES =====

# Dynamic.xyz Configuration
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# Blockchain Configuration
NEXT_PUBLIC_RPC_URL=your_rpc_url_here
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_NETWORK_CHAIN_ID=8453

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret_here

# Agents API Configuration
AGENTS_APP_ID=your_agents_app_id_here
AGENTS_APP_SECRET=your_agents_app_secret_here

# ===== OPTIONAL VARIABLES =====

# Card Payment Feature (Crossmint Integration)
# Set to 'true' to enable, 'false' or omit to disable
NEXT_PUBLIC_ENABLE_CARD_PAYMENTS=false
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=your_crossmint_project_id_here
NEXT_PUBLIC_CROSSMINT_BASE_URL=https://staging.crossmint.com

# Network Configuration
NEXT_PUBLIC_NETWORK_NAME=Base
NEXT_PUBLIC_NETWORK_CURRENCY=ETH

# ===== ADDITIONAL CONFIGURATION =====

# Brand Configuration
NEXT_PUBLIC_BRAND_NAME=FanSpark
NEXT_PUBLIC_PROJECT_NAME=Reward Crate Minter
NEXT_PUBLIC_BRAND_URL=https://www.fanspark.xyz
NEXT_PUBLIC_METADATA_BASE_URL=https://checkout.fanspark.xyz
NEXT_PUBLIC_DEFAULT_COLLECTION=reward-crate

# Network Configuration (Advanced)
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_NETWORK_DISPLAY_NAME=Base Sepolia Testnet
NEXT_PUBLIC_BLOCK_EXPLORER_URL=https://sepolia.basescan.org
NEXT_PUBLIC_BLOCK_EXPLORER_NAME=BaseScan
`;

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local file successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Open .env.local in your editor');
  console.log('2. Replace the placeholder values with your actual credentials');
  console.log('3. Save the file');
  console.log('4. Restart your development server');
  console.log('');
  console.log('🔍 For detailed information about each variable, see ENVIRONMENT_VARIABLES.md');
  console.log('');
  console.log('⚠️  Important: Never commit .env.local to version control!');
  
} catch (error) {
  console.error('❌ Failed to create .env.local file:', error.message);
  process.exit(1);
} 