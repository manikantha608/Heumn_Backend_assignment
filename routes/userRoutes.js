const express = require("express");
const router = express.Router()

const userController = require("../controllers/userController")

router.post("/register",userController.registration);
router.post("/login",userController.login)

module.exports = router;