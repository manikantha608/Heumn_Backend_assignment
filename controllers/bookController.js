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
      filter.author = { $regex: author, $options: "i" }; 
    }
    if (title) {
      filter.title = { $regex: title, $options: "i" }; 
    }

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch the books from the database with filters, pagination, and sorting
    const books = await Book.find(filter)
      .sort({ [sortBy]: 1 }) // Sort by the specified field (default is by title)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Get the total number of books matching the filter
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

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {addBook,updateBook,deleteBook,booksList}