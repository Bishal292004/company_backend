require("dotenv").config();

const readline = require("readline");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function createAdmin() {
    try {
        await connectDB();

        const name = (await ask("Admin full name: ")).trim();
        const email = (await ask("Admin email: ")).trim().toLowerCase();
        const password = await ask("Admin password (minimum 8 characters): ");
        const phone = (await ask("Phone: ")).trim();
        const department = (await ask("Department: ")).trim();
        const position = (await ask("Position: ")).trim();

        if (!name || !email || password.length < 8 || !phone || !department || !position) {
            throw new Error("All fields are required and password must be at least 8 characters.");
        }

        const existing = await User.findOne({ email });

        if (existing) {
            throw new Error("A user with this email already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            department,
            position,
            role: "admin"
        });

        console.log(`Admin created successfully: ${admin.email}`);
    } catch (error) {
        console.error("Could not create admin:", error.message);
    } finally {
        rl.close();
        await mongoose.connection.close().catch(() => {});
    }
}

createAdmin();
