const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const {
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/adminController");

const router = express.Router();

router.use(authenticateUser, requireAdmin);

router.get("/employees", getEmployees);
router.get("/employees/:id", getEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

module.exports = router;
