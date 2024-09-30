const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const borrowingBooksController = require("../controllers/borrowingBooksController");
const router = express.Router({ mergeParams: true });


router.post("/:bookId/barrow-book",verifyToken,borrowingBooksController.borrowingBook);
router.put("/:id/return-book",verifyToken,borrowingBooksController.returnBook);
router.get("/barrowed-books-history",verifyToken,borrowingBooksController.borrowHistory)

router.get("/mostBorrowedBooks",borrowingBooksController.mostBorrowedBooks);
router.get("/mostActiveMembers",borrowingBooksController.mostActiveMembers);
router.get("/bookAvailabilityReport",borrowingBooksController.bookAvailabilityReport)

module.exports = router;