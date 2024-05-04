const Expense = require("../models/expenseSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createController = async(req, res)=> {
    const templeId = req.params.templeId ; 
    const formData = req.body ; 

    if(!templeId) {
        throw new ExpressError(400, "Temple not found.");
    }

    if(!formData.title && !formData.description && !formData.amount && !formData.date && !formData.category && !formData.status) {
        throw new ExpressError(400, "Please provide all expense details.");
    }
    
    const newExpense = new Expense({
        title : formData.title,
        description : formData.description,
        amount : formData.amount,
        date : formData.date,
        category : formData.category,
        status : formData.status,
        temple : templeId,
    });

    await newExpense.save();
    res.status(200).json( "Expense added successfully.");
}