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
 
const booksList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    // Ensure page and limit are numbers
    const pageNum = Number(page);
    const limitNum = Number(limit);

    // Validate pagination inputs
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    // Query with filters, skip, and limit for pagination
    let query = Book.find(filters)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Get total number of books with the current filters
    const totalBooks = await Book.countDocuments(filters);

    // Check if the requested page exists
    if (totalBooks && pageNum > Math.ceil(totalBooks / limitNum)) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Fetch books
    const books = await query;

    // If no books are found
    if (!books.length) {
      return res.status(404).json({ message: "No books found" });
    }

    // Return paginated books data
    res.status(200).json({
      status: "success",
      data: books,
      pagination: {
        totalBooks,
        currentPage: pageNum,
        totalPages: Math.ceil(totalBooks / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message});
  }
};



module.exports = {addBook,updateBook,deleteBook,booksList}