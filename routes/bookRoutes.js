const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const verifyToken = require("../middlewares/verifyToken");
const restrict = require("../middlewares/restrictedAccess");

router.post("/add-book",verifyToken,restrict("admin"),bookController.addBook);
router.put("/update-book/:bookId",verifyToken,restrict("admin"),bookController.updateBook)
router.delete("/delete-book/:bookId",verifyToken,restrict("admin"),bookController.deleteBook)
router.get("/all-books",bookController.booksList)

module.exports = router;