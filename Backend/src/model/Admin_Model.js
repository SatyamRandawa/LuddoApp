const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    Firstname: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    postCode: {
        type: String
    },
    otp: {
        type: Number,
        default: ""
    },
    wrongOTP: {
        type: Number,
        default: 0
    },

    wrongpassword: {
        type: Number,
        default: 0
    },

    userpasswordlimit: {
        type: Number,
        default: 5
    },
    adminpasswordlimit: {
        type: Number,
        default: 5
    },
    Doctorpasswordlimit: {
        type: Number,
        default: 5
    },
    agentotplimit: {
        type: Number,
        default: 5
    },
    adminotplimit: {
        type: Number,
        default: 5
    },
    orgotplimit: {
        type: Number,
        default: 5
    },
    role: {
        type: String
    },

    blocked: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Number,
        default: 0
    }


}, { timestamps: true })

module.exports = mongoose.model('admin', adminSchema)