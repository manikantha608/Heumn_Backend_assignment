const Borrow = require("../models/BarrowingSystem");
const Book = require("../models/Book");
const User = require("../models/User"); 

const borrowingBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId  = req.userId;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.copies <= 0) {
      return res.status(400).json({ message: "No copies available to borrow" });
    }

    req.body.book = bookId;
    req.body.user = userId;

    const borrow = await Borrow.create(req.body);

    book.copies -= 1;
    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      data: {
        borrow,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const returnBook = async (req, res) => {
  try {
    const borrowId = req.params.id;

    const borrowRecord = await Borrow.findById(borrowId);
    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    const book = await Book.findById(borrowRecord.book);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.copies += 1;
    await book.save();

    await Borrow.findByIdAndDelete(borrowId);

    res.status(200).json({
      message: "Book returned successfully",
      data: { book },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const borrowHistory = async (req, res) => {
  try {
    const userId = req.userId; 
    const borrowRecords = await Borrow.find({ user: userId }).populate("book");

    res.status(200).json({
      message: "success",
      data: { borrowRecords },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const mostBorrowedBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; 

    const report = await Borrow.aggregate([
      // Group by book and count how many times each book was borrowed
      {
        $group: {
          _id: "$book",
          borrowCount: { $sum: 1 }
        }
      },
      // Sort by the borrow count in descending order
      {
        $sort: { borrowCount: -1 }
      },
      // Limit to top N books (e.g., top 10)
      {
        $limit: limit
      },
      // Lookup book details from the Book collection
      {
        $lookup: {
          from: "books", // The collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails"
        }
      },
      // Unwind the book details array
      {
        $unwind: "$bookDetails"
      },
      // Project the fields you want to include in the response
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          borrowCount: 1
        }
      }
    ]);

    res.status(200).json({
      message: "success",
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mostActiveMembers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; 

    const report = await Borrow.aggregate([
      // Group by user and count how many times each user borrowed
      {
        $group: {
          _id: "$user",
          borrowCount: { $sum: 1 }
        }
      },
      // Sort by the borrow count in descending order
      {
        $sort: { borrowCount: -1 }
      },
      // Limit to top N members (e.g., top 10)
      {
        $limit: limit
      },
      // Lookup user details from the User collection
      {
        $lookup: {
          from: "users", // The collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      // Unwind the user details array
      {
        $unwind: "$userDetails"
      },
      // Project the fields you want to include in the response
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          borrowCount: 1
        }
      }
    ]);

    res.status(200).json({
      message: "success",
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookAvailabilityReport = async (req, res) => {
  try {
    // Total number of books
    const totalBooks = await Book.countDocuments({});

    // Count the number of distinct borrowed books
    const borrowedBooks = await Borrow.distinct("book").then(borrowed => borrowed.length);

    // Count the number of books that are available (copies > 0)
    const availableBooks = await Book.countDocuments({ copies: { $gt: 0 } });

    // Prepare the report
    const report = {
      totalBooks,
      borrowedBooks,
      availableBooks
    };

    res.status(200).json({
      message: "success",
      data: report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { borrowingBook,returnBook,borrowHistory ,mostBorrowedBooks ,mostActiveMembers,bookAvailabilityReport};
