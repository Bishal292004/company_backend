function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required."
        });
    }

    next();
}

function requireEmployee(req, res, next) {
    if (!req.user || req.user.role !== "employee") {
        return res.status(403).json({
            success: false,
            message: "Employee access required."
        });
    }

    next();
}

module.exports = {
    requireAdmin,
    requireEmployee
};
