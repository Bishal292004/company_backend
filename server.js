require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",").map(origin => origin.trim())
    : true;

const frontendPath = path.resolve(
    __dirname,
    "../Web-technology-Website/projects/Company/frontend"
);

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

if (require("fs").existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    app.get("/", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.json({
            success: true,
            message: "Company API is running."
        });
    });
}

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Company API is healthy."
    });
});

let databaseConnection;

app.use("/api", async (req, res, next) => {
    try {
        databaseConnection ??= connectDB();
        await databaseConnection;
        next();
    } catch (error) {
        databaseConnection = undefined;
        next(error);
    }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/admin", adminRoutes);

// Simple API 404
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

// General error handler
app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });
});

if (require.main === module) {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
        throw new Error("MONGO_URI and JWT_SECRET are required.");
    }

    databaseConnection = connectDB();
    databaseConnection.then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }).catch(error => {
        console.error("Server could not start:", error.message);
        process.exit(1);
    });
}

module.exports = app;
