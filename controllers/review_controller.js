const User = require('../models/user');
const Review = require('../models/review');

// Create a new review
module.exports.newReview = async (req, res) => {
    try {
        // Find the recipient user by ID
        let recipient = await User.findById(req.params.id);
        
        if (!recipient) {
            req.flash('error', "User not found!");
            return res.redirect('/');
        }

        // Remove the recipient's ID from the user's list of users to review
        for (let i = 0; i < req.user.userToReview.length; i++) {
            if (req.user.userToReview[i] == recipient.id) {
                await req.user.userToReview.splice(i, 1);
                await req.user.save();
                break;
            }
        }

        if (req.user) {
            // Create a new review

            const new_review = await Review.create({
                content: req.body.newReview,
                reviewBy: req.user.id,
                reviewBy_name: req.user.name,
                reviewTo: recipient.id,
            });

            // Add the new review to the recipient's list of received reviews
            await recipient.reviewRecivedFrom.push(new_review);
            await recipient.save();
        } else {
            req.flash('error', "Please log in!");
            return res.redirect("/users/sign-in");
        }

        return res.redirect('/');
    } catch (err) {
        console.log('error', err);
        return res.redirect('/');
    }
};
