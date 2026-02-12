const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Contract = require('../models/Contract');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const upload = multer({ storage: multer.memoryStorage() });

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Analyze a contract PDF
// @route   POST /api/analyze
// @access  Private
router.post('/', protect, upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // 1. Extract Text from PDF
        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const originalText = pdfData.text;

        const jurisdiction = req.body.jurisdiction || 'Global';
        const STANDARD_CLAUSES = ['Confidentiality', 'Indemnification', 'Termination', 'Liability Cap', 'Force Majeure', 'Dispute Resolution'];

        // 2. AI Analysis with Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Stick to 'gemini-pro' as 'gemini-1.5-flash' might be restricted/unavailable in current API version region
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        let systemContext = `You are a legal expert analyzing a contract for the ${jurisdiction} jurisdiction.`;
        if (jurisdiction === 'India') {
            systemContext += `
            Special Instructions for Indian Law (Contract Act 1872):
            1. Check for "Stamp Duty" payment (e.g., "Maharashtra Stamp Act", "Non-Judicial Stamp Paper"). If missing, add a compliance alert: "No Stamp Duty reference found. Document may be inadmissible in court."
            2. Check for "Arbitration" citing "Arbitration and Conciliation Act, 1996".
            3. CRITICAL: Any "Non-Compete" clause is generally VOID under Section 27 of the Indian Contract Act, unless for sale of goodwill. Flag this as HIGH RISK.
            4. CONSTITUTIONALITY CHECK: Flag any clause that might violate "Public Policy" (Section 23) or Fundamental Rights under the Constitution of India.
            `;
        } else if (jurisdiction === 'US') {
            systemContext += `Flag "Non-Compete" clauses carefully, noting state-specific bans (e.g., California). Ensure clauses generally align with UCC and public policy.`;
        } else if (jurisdiction === 'UK') {
            systemContext += `Reference the "Unfair Contract Terms Act 1977" and "Consumer Rights Act 2015" where applicable.`;
        }

        const prompt = `
        ${systemContext}

        Task: 
        1. Analyze the contract text.
        2. Extract clauses and identify risks.
        3. CHECK FOR MISSING CLAUSES from this standard list: ${JSON.stringify(STANDARD_CLAUSES)}.
           - If a standard clause is absent, mark it as "MISSING" with a high risk score.
        4. Generate specific Compliance Alerts (especially for Stamp Duty in India).

        You must return the result as a valid JSON object. Do not include any text outside the JSON object. Do not use markdown formatting.

        JSON Format:
        {
            "riskScore": Number (0-100),
            "summary": "String",
            "clauses": [
                {
                    "title": "String",
                    "text": "String (snippet)",
                    "risk": "High" | "Medium" | "Low",
                    "explanation": "String"
                }
            ],
            "missingClauses": [
                {
                    "clause": "String (Name from standard list)",
                    "status": "Found" | "MISSING",
                    "riskScore": Number,
                    "recommendation": "String (Why it's needed)"
                }
            ],
            "complianceAlerts": ["String (List of critical compliance warnings)"]
        }

        Contract Text:
        ${originalText.substring(0, 30000)}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Robust cleanup for markdown code blocks
        text = text.replace(/```json\n?|\n?```/g, '').trim();
        
        // Try to parse, if fails, log the text
        let analysisConfig;
        try {
            analysisConfig = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            console.error("Raw AI Response Text:", text);
            throw new Error("AI response was not valid JSON. Check backend console for raw output.");
        }

        // 3. Save to DB
        const contract = await Contract.create({
            userId: req.user._id,
            fileName: req.file.originalname,
            jurisdiction: jurisdiction,
            originalText: originalText,
            analysis: analysisConfig
        });

        res.status(201).json(contract);

    } catch (error) {
        console.error("Analysis Request Failed:", error);
        res.status(500).json({ 
            message: 'Failed to analyze contract', 
            error: error.message,
            details: error.toString() 
        });
    }
});

// @desc    Get all contracts for user
// @route   GET /api/contracts
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const contracts = await Contract.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contracts' });
    }
});

// @desc    Get single contract
// @route   GET /api/contracts/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (contract && contract.userId.toString() === req.user._id.toString()) {
            res.json(contract);
        } else {
            res.status(404).json({ message: 'Contract not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contract' });
    }
});

// @desc    Delete contract
// @route   DELETE /api/contracts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        // Check user ownership
        if (contract.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await contract.deleteOne();
        res.json({ message: 'Contract removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
