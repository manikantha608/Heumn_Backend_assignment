const Book = require("../models/Book")

const addBook = async(req,res)=>{
    try{
       const {title,author,ISBN,publicationDate,genre,copies} = req.body;     
     
       const book = new Book({
         title,author,ISBN,publicationDate,genre,copies           
       })
               
       await book.save()  
       return res.status(200).json({message:"Book added successfully...!"})           
    }catch(error){
       res.status(500).json({message:error.message})             
    }
}


const updateBook = async(req,res) => {
    try{
      const bookId = req.params.bookId;
      const book = await Book.findByIdAndUpdate(bookId,req.body,{
         new:true,
         runValidators:true
      });

      if(!book){
         return res.status(404).json({message:"No book found"})          
      }

      res.status(200).json({message:"updated successfully...!"})

    }catch(error){
      return res.status(500).json({message:error.message})
    }
}

const deleteBook = async(req,res) => {
     try{
      const bookId = req.params.bookId;
      const deletedBook = await Book.findByIdAndDelete(bookId);
      if(!deletedBook){
         return res.status(404).json({message:"No book found"})          
      }
      res.status(200).json({ message: "Book deleted successfully" })
     }catch(error){
        return res.status(500).json({message:error.message})
     }
}

// const booksList = async (req, res, next) => {
//    const { page = 1, limit = 10, ...filters } = req.query;
 
//    let query = Book.find(filters)
//      .skip((page - 1) * limit)
//      .limit(Number(limit));
 
//    const totalBooks = await Book.countDocuments(filters);
   
//    if ((page - 1) * limit >= totalBooks) {
//      return res.status(404).json({message:"Page not found"})
//    }
 
//    const books = await query;
 
//    if (!books.length) {
//      return res.status(404).json({message:"No books found"})
//    }
 
//    res.status(200).json({ status: "success", data: books });
//  };
 


// const booksList = async (req, res) => {
//   console.log("hiiiiiiiiiiiiiiiiiiiiii")
//   let excludeFields = ["page", "limit"];
//   let queryObj = { ...req.query };
//   excludeFields.forEach((ele) => delete queryObj[ele]);
//   let query = Book.find(queryObj);

//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 10;
//   let skip = (page - 1) * limit;
//   query = query.skip(skip).limit(limit);

//   if (req.query.page) {
//     const booksCount = await Book.countDocuments(queryObj);
//     console.log(booksCount,"count")
//     if (skip >= booksCount) {
//       return res.status(404).json({message:"this page not found"})
//     }
//   }
//   const book = await query;
//   if (!book) {
//     return res.status(404).json({message:"no book found"})
//   }

//   res.status(200).json({
//     message: "success",
//     data: book,
//   });
//   console.log(res.json({data: book}),"mybooks")
// }


// const booksList = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10, ...filters } = req.query;

//     const pageNum = Number(page);
//     const limitNum = Number(limit);

//     if (pageNum < 1 || limitNum < 1) {
//       return res.status(400).json({ message: "Invalid pagination parameters" });
//     }

//     const totalBooks = await Book.countDocuments(filters);

//     if (totalBooks && pageNum > Math.ceil(totalBooks / limitNum)) {
//       return res.status(404).json({ message: "Page not found" });
//     }

//     const books = await Book.find(filters)
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum);

//     if (!books.length) {
//       return res.status(404).json({ message: "No books found" });
//     }
//   console.log("bookks",books)
//      res.status(200).json({
//       status: "success",
//       data: books,
//       pagination: {
//         totalBooks,
//         currentPage: pageNum,
//         totalPages: Math.ceil(totalBooks / limitNum),
//       },
//     });
//     res.send(books)
//     console.log(res.send(books))
//     res.send(books)
//   } catch (error) {
//     return next(error); // Ensure error is properly passed to the error handler
//   }
// };

const booksList = async (req, res) => {
  try {
    // Extract query parameters for filtering, pagination, and sorting
    const { page = 1, limit = 10, genre, author, title, sortBy = "title" } = req.query;

    // Build a filter object based on the query parameters
    const filter = {};
    if (genre) {
      filter.genre = genre;
    }
    if (author) {
      filter.author = { $regex: author, $options: "i" }; // Case-insensitive search
    }
    if (title) {
      filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
    }

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch the books from the database with filters, pagination, and sorting
    const books = await Book.find(filter)
      .sort({ [sortBy]: 1 }) // Sort by the specified field (default is by title)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Get the total number of books matching the filter (for pagination metadata)
    const totalBooks = await Book.countDocuments(filter);

    // Prepare the response
    res.status(200).json({
      message: "success",
      data: {
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBooks / limit),
          totalBooks
        }
      }
    });
    console.log(data,"mybooks")
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {addBook,updateBook,deleteBook,booksList}