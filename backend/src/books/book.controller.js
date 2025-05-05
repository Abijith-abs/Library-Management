const Books = require("./book.model");

const postBook = async (req, res) => {
    try{
        const newBook = await Books({...req.body});
        await newBook.save();
        res.status(200).send({message:"Book Created Successfully",book:newBook});

    }catch(error){
        console.error("Error creating book:", error);
        res.status(500).send({message:"Error creating book"});
    }
}

//get all books

const getAllBooks = async (req, res) => {
    try{
        const books = await Books.find().sort({createdAt:-1});
        res.status(200).send({books});

    } catch(error){
        console.error("Error getting books:", error);
        res.status(500).send({message:"Error getting books"});
    }
}

const getSingleBook = async (req, res) => {
    try{
        const {id} = req.params;
        const book = await Books.findById(id);
        if(!book){
            return res.status(404).send({message:"Book not found"});
        }
        return res.status(200).send({book});

    } catch(error){
        console.error("Error getting book:", error);
        res.status(500).send({message:"Error getting book"});

    }
}

const updateBookData = async (req, res) => {
    try {
        const { id } = req.params;
        const updateBook = await Books.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateBook) {
            return res.status(404).send({ message: "Book Not Found" });
        }

        res.status(200).send({
            message: "Book Updated successfully",
            book: updateBook
        });

    } catch (error) {
        console.error("Failed to update the book data", error);
        res.status(500).send({ message: "Error updating book data" });
    }
}


const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteBook = await Books.findByIdAndDelete(id);

        if (!deleteBook) {
            return res.status(404).send({ message: "Book Not Found" });
        }                                                                                   
        res.status(200).send({
            message: "Book Deleted successfully",
            book: deleteBook
        });
    } catch (error) {
        console.error("Failed to delete the book", error);
        res.status(500).send({ message: "Error deleting book" });
    }
}


module.exports = {
    postBook,
    getAllBooks,
    getSingleBook,
    updateBookData,
    deleteABook

}