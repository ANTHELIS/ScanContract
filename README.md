# ContractScan (Hackathon MVP)

ContractScan is a vertical SaaS for legal contract review, built for a 48-hour hackathon. It allows users to upload PDF contracts and receive AI-generated risk analysis using Google Gemini.

## Project Structure

- `backend/`: Node.js + Express API server with MongoDB.
- `frontend/`: Next.js 14 App Router frontend.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via cloud URI)
- Google Gemini API Key

### 1. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create a `.env` file (if not exists) and configure:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/contractscan
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Install dependencies and run:
```bash
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Frontend Setup

Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies and run:
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

## Features
- **User Authentication**: Secure signup and login.
- **PDF Upload**: Parse and extract text from contracts.
- **AI Analysis**: Identify risks and clauses using Google Gemini.
- **Dashboard**: View history of analyzed contracts.
