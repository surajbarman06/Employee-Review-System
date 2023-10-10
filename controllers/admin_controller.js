const User = require('../models/user');
const Review = require('../models/review');

// Render the assign work page
module.exports.assignWork = async function (req, res) {
    let employee = await User.find({});

    return res.render('admin', {
        title: 'ERSystem | Assign Work',
        employee: employee
    });
}


// Show the employee list
module.exports.showEmployeeList = async function (req, res) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You are not authorized!');
        return res.redirect('/users/sign-in');
    }
    if (req.user.isAdmin == false) {
        req.flash('error', 'You are not authorized');
        return res.redirect('/');
    }
    let employeList = await User.find({});

    return res.render('employee', {
        title: "ERSystem | Employee List",
        employes: employeList
    });
}



// View employee reviews
module.exports.viewEmployeeReviews = async function(req , res){
    let reviews = await Review.find({ reviewTo: req.params.id }).sort('-createdAt');
    let employee = await User.findById(req.params.id );

    return res.render( 'employee_review',{
        title: "ERSystem | Reviews",
        reviews, 
        employee            
    });
}



// Set reviewers for an employee
module.exports.setReviewers = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            req.flash('success', 'Please login!');
            return res.redirect('/users/sign-in');
        }
        else {
            let loggedInUser = await User.findById(req.user.id);

            if (!loggedInUser.isAdmin) {
                req.flash('error', 'You are not authorized');
                return res.redirect('/users/create-session');
            }
            else if (req.body.employee == "Select an Employee") {
                req.flash('error', 'Please select an employee!');
                return res.redirect('back');
            }
            else {
                let allEmployees = await User.find({});
                let selectedEmployee = await User.findById(req.body.employee);

                for (let i = 0; i < allEmployees.length; i++) {
                    if (allEmployees[i]._id.toString() !== selectedEmployee._id.toString()) {
                        let isAlreadyAdded = allEmployees[i].userToReview.includes(selectedEmployee._id);

                        if (!isAlreadyAdded) {
                            allEmployees[i].userToReview.push(selectedEmployee._id);
                            await allEmployees[i].save();
                        }
                    }
                }

                req.flash('success', `Review is created for ${selectedEmployee.name}`);
                return res.redirect('back');
            }
        }
    } catch (err) {
        console.log('Error in setting up the user: ' + err);
        req.flash('error', 'Unable to assign a task!');
        return res.redirect('back');
    }
}



// Make an employee an admin
module.exports.newAdmin = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            req.flash("success", 'Please log in!');
            return res.redirect('/users/sign-in');
        }
        if (req.user.isAdmin == false) {
            req.flash('error', 'You cannot make anyone an admin!');
            return res.redirect('/');
        }

        if (req.body.employee == "Select to make an Admin") {
            req.flash('error', 'Please select an employee');
            return res.redirect('back');
        }
        let user = await User.findById(req.body.employee);
        if (!user) {
            req.flash('error', 'Unable to find employee');
            return res.redirect('back');
        }
        user.isAdmin = true;
        await user.save();
        req.flash('success', `${user.name} is now an admin`);
    } catch (err) {
        req.flash('error', 'Internal Server Error!');
        console.log(err);
    }
    return res.redirect('back');
}



// Delete an employee
module.exports.deleteEmployee = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            req.flash('error', 'Please login!');
            return res.redirect('users/sign-in');
        }

        if (!req.user.isAdmin) {
            req.flash('error', 'You are not an admin!');
            return res.redirect('/');
        }

        await User.deleteOne({ _id: req.params.id });

        // Remove the employee from the userToReview array of other employees
        await User.updateMany(
            { userToReview: req.params.id },
            { $pull: { userToReview: req.params.id } }
        );

        req.flash('success', 'User deleted!');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}



// Render the add employee form
module.exports.addEmployee_form = function (req, res) {
    return res.render('addEmployee', {
        title: 'ERSystem | Add Employee'
    });
}



// Add an employee
module.exports.addEmployee = async function (req, res) {
    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Password should be equal to Confirm Password');
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

        return res.redirect('/admin/view-employee');
    }
    return res.redirect('back');
}
