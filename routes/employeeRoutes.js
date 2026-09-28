const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const { requireEmployee } = require("../middleware/roleMiddleware");
const {
    getProfile,
    getAdmins
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/profile", authenticateUser, requireEmployee, getProfile);
router.get("/admins", authenticateUser, requireEmployee, getAdmins);

module.exports = router;
