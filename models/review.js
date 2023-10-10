const mongoose = require('mongoose');


const reviewSchema = mongoose.Schema({
    content: {
        type: 'String',
        require: true
    },
    reviewTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewBy_name: {// reviewBy_name isliye kyuki agar user delete ho chuak hai to review bhi nahi rhega
        type: 'String',
        require: true
    }
},
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;