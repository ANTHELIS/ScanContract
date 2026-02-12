<<<<<<< HEAD
# 📜 ContractScan
=======
# ContractScan 
>>>>>>> 815fd0b083e15f6bdee89696b32b7bbce1be9ea4

**AI-Powered Contract Analysis & Risk Assessment Platform**

ContractScan is a modern vertical SaaS application designed to revolutionize legal contract review. Built for speed and accuracy, it allows users to upload PDF contracts and receive instant, AI-generated risk analysis, clause detection, and compliance checks using the power of Google Gemini.

## 🚀 Key Features

- **🤖 AI-Powered Analysis**: Automatically identifies potential risks, missing clauses, and summarizes key terms using Google Gemini AI.
- **🔍 Real-time Search**: Instantly filter your contract history by filename with a responsive search bar.
- **📱 Fully Mobile Responsive**: A seamless experience across all devices, featuring a mobile-optimized navigation drawer and adaptive layouts.
- **📊 Smart Dashboard**: A comprehensive overview of your recent scans, categorized by risk score (Low, Medium, High).
- **⚖️ Jurisdiction Support**: Tailor the analysis based on specific legal frameworks (e.g., US Law, EU GDPR, Indian Contract Act).
- **🔒 Secure & Private**: User authentication and secure document handling ensure your data remains protected.
- **📄 Printable Reports**: Generate and print detailed analysis reports directly from the application.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/) for styling, [Lucide React](https://lucide.dev/) for icons.
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/).
- **Database**: [MongoDB](https://www.mongodb.com/).
- **AI Engine**: [Google Gemini API](https://ai.google.dev/).

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Running locally or via MongoDB Atlas)
- **Google Gemini API Key** (Get one [here](https://aistudio.google.com/app/apikey))

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5000
    MONOG_URI=mongodb://localhost:27017/contractscan  # Or your MongoDB Atlas URI
    JWT_SECRET=your_super_secret_jwt_key
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  Start the server:
    ```bash
    npm run dev
    ```
    The backend API will start running on `http://localhost:5000`.

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env.local` file in the `frontend` directory (optional, defaults to localhost):
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📸 Screenshots

*(Add screenshots of your Dashboard, Analysis Page, and Mobile View here)*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
