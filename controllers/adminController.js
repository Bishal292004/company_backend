const mongoose = require("mongoose");
const User = require("../models/User");

const allowedFields = ["name", "phone", "department", "position", "role"];

async function getEmployees(req, res) {
    try {
        const employees = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            employees
        });
    } catch (error) {
        console.error("Get employees error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while loading employees."
        });
    }
}

async function getEmployee(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID."
            });
        }

        const employee = await User.findById(req.params.id).select("-password");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        res.json({
            success: true,
            employee
        });
    } catch (error) {
        console.error("Get employee error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while loading employee."
        });
    }
}

async function updateEmployee(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID."
            });
        }

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No permitted fields were provided."
            });
        }

        if (updates.role && !["admin", "employee"].includes(updates.role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role."
            });
        }

        if (updates.email || updates.password) {
            return res.status(400).json({
                success: false,
                message: "Email and password cannot be changed through this endpoint."
            });
        }

        const employee = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        res.json({
            success: true,
            message: "Employee updated successfully.",
            employee
        });
    } catch (error) {
        console.error("Update employee error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating employee."
        });
    }
}

async function deleteEmployee(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID."
            });
        }

        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "An admin cannot delete their own account from this screen."
            });
        }

        const employee = await User.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully."
        });
    } catch (error) {
        console.error("Delete employee error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting user."
        });
    }
}

module.exports = {
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
};
