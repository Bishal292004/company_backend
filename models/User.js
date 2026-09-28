const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        department: {
            type: String,
            required: true,
            trim: true
        },
        position: {
            type: String,
            required: true,
            trim: true
        },
        experience: {
            type: String,
            enum: ["Entry level", "1-3 years", "3-5 years", "5-8 years", "8+ years"],
            default: "Entry level"
        },
        role: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
