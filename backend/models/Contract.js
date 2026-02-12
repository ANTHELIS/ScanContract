const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileName: {
        type: String,
        required: true
    },
    originalText: {
        type: String,
        required: true
    },
    analysis: {
        riskScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        summary: {
            type: String,
            required: true
        },
        clauses: [{
            title: { type: String },
            text: { type: String },
            risk: { 
                type: String, 
                enum: ['High', 'Medium', 'Low'],
                default: 'Low'
            },
            explanation: { type: String }
        }]
    }
}, {
    timestamps: true
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
