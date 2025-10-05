# BiteShare 🍽️

A food sharing platform that connects UCLA dining halls with local shelters using AI-powered food analysis and volunteer coordination.

## Features

- **AI Food Analysis**: Uses AWS Bedrock (Claude 3.5 Sonnet) to automatically identify food items, nutrition info, dietary tags, and allergens from photos
- **Natural Language Processing**: Parses shelter requests written in plain English to extract structured data
- **Three User Portals**: 
  - UCLA Dining: Donate leftover food
  - Shelters: Request food in natural language
  - Volunteers: Coordinate deliveries
- **Real-time Matching**: AI matches food donations with shelter needs

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js API server
- **AI/ML**: AWS Bedrock with Claude 3.5 Sonnet
- **Notifications**: AWS SNS (planned)
- **Maps**: Volunteer coordination with interactive maps

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up AWS credentials** (create `.env.local`):
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

3. **Start the API server**:
   ```bash
   node server.js
   ```

4. **Start the frontend** (in another terminal):
   ```bash
   npm run dev
   ```

## AWS Services Used

- **Amazon Bedrock**: AI image analysis and natural language processing
- **IAM**: Secure access management
- **SNS**: Volunteer notifications (planned)

## Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.tsx     # Main landing page
│   ├── DiningPortal.tsx # Food donation interface
│   ├── ShelterPortal.tsx# Food request interface
│   └── VolunteerPortal.tsx# Delivery coordination
├── services/
│   └── bedrockAgent.ts  # AWS Bedrock integration
└── types.ts            # TypeScript definitions

server.js               # Express API server
api/bedrock/           # API endpoints (legacy)
```

## Demo

Upload a food image in the dining portal to see real AI analysis in action! The system will automatically identify the food, provide nutrition information, detect allergens, and suggest appropriate dietary tags.

## Contributing

This project was built to help reduce food waste while supporting local communities. Feel free to contribute improvements!