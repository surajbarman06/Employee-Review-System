const User = require('../models/user');
const Review = require('../models/review');

// Render the home page
module.exports.home = async function (req, res) {
    try {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            req.flash('error', 'Please sign in!');
            return res.redirect('/users/sign-in');
        }

        // Find the logged-in user by ID
        let user = await User.findById(req.user.id);
        
        // Find all the reviews for the logged-in user
        let review = await Review.find({ reviewTo: req.user.id }).sort('-createdAt');

        let recipient = [];
        let reviews = [];

        // Find the users to review for the logged-in user
        for (let i = 0; i < user.userToReview.length; i++) {
            let userToReview = await User.findById(user.userToReview[i]);
            recipient.push(userToReview);
        }

        // Prepare the reviews to be displayed
        for (let i = 0; i < review.length; i++) {
            let reviewToShow = {
                name: review[i].reviewBy_name,
                content: review[i].content
            };
            reviews.push(reviewToShow);
        }

        return res.render('home', {
            title: "ERSystem | HOME",
            recipient: recipient,
            reviews: reviews,
            user: user
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};
