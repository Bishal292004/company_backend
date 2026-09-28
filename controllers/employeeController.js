const User = require("../models/User");

async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while loading profile."
        });
    }
}

async function getAdmins(req, res) {
    try {
        const admins = await User.find({ role: "admin" })
            .select("name email phone department position createdAt")
            .sort({ name: 1 });

        res.json({
            success: true,
            admins
        });
    } catch (error) {
        console.error("Admin information error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while loading admin information."
        });
    }
}

module.exports = {
    getProfile,
    getAdmins
};
