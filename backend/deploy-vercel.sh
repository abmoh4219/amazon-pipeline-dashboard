#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check command existence
command_exists() {
    command -v "$1" &> /dev/null
}

# Install Vercel CLI if not exists
if ! command_exists vercel; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in, if not, log in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}Please log in to Vercel...${NC}"
    vercel login
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Build the application
echo -e "\n${GREEN}Building the application...${NC}"
if ! npm run build; then
    echo -e "${RED}Build failed. Installing rimraf and retrying...${NC}"
    npm install --save-dev rimraf cross-env
    if ! npm run build; then
        echo -e "${RED}Build failed after installing rimraf. Please check the build errors above.${NC}"
        exit 1
    fi
fi

# Check if .vercel directory exists, if not link the project
if [ ! -d ".vercel" ]; then
    echo -e "\n${YELLOW}Linking Vercel project...${NC}"
    vercel link
fi

# Deploy to Vercel
echo -e "\n${GREEN}Deploying to Vercel...${NC}"
vercel --prod --confirm

echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}Note: Make sure to set up your environment variables in the Vercel dashboard if you haven't already.${NC}"
echo -e "${YELLOW}You can visit your deployment at: https://$(jq -r '.name' .vercel/project.json).vercel.app${NC}"

# Make the script executable
chmod +x deploy-vercel.sh
