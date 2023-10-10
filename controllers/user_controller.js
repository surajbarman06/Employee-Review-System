const User = require('../models/user'); 



// Render Sign In page
module.exports.signIn = function (req, res) {
    return res.render('sign_in', {
        title: 'ERSystem | Sign-In'
    });
}


// Render Sign Up page
module.exports.signUp = function (req, res) {
    return res.render('sign_up', {
        title: 'ERSystem | Sign-Up'
    });
}



// Create a new user
module.exports.create = async function (req, res, next) {
    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Password should be equal');
        return res.redirect('back');
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: false
        });
    }
    next();
}


// Create session for logged in user
module.exports.createSession = async function (req, res) {
    req.flash('success', 'You are logged In');
    return res.redirect('/');
}



// Destroy user session (logout)
module.exports.destroySession = function (req, res, done) {
    return req.logout((err) => {
        if (err) {
            return done(err);
        }
        req.flash('success', 'Logged Out Successfully!');
        return res.redirect('/users/sign-in');
    });
}


// Render Forget Password page
module.exports.forgetPasswordPage = function (req, res) {
    return res.render('forget_password', {
        title: 'ERSystem | Forget Password'
    });
}


// Update user's password with newly created password
module.exports.forgetPasswordLink = async function (req, res) {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.redirect('/users/signUp');
    }
    if (req.body.password == req.body.confirmPassword) {
        req.flash('success', 'Password Changed :)');
        user.password = req.body.password;
        await user.updateOne({ password: req.body.password });
        return res.redirect('/users/sign-in');
    }
    return res.redirect('back');
}


// Make a user an admin
module.exports.makeAdmin = async function (req, res) {
    try {
        if (req.body.admin_password == 'ers') {
            let user = await User.findById(req.user.id);
            user.isAdmin = true;
            user.save();
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error', error);
        return;
    }
}
