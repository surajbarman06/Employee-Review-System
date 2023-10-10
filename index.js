const express = require('express');
const port = 7000;
const app = express();
const expressLayout = require('express-ejs-layouts');
const db = require('./config/mongoose');// requring DataBase

// Creating session
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local');

// requiring mongo-store, so that we can use the existing user even after server start
const MongoStore = require('connect-mongo');

// they are used for showing action notifications
const flash = require('connect-flash');
const flashMiddleWare = require('./config/flashMiddleware');

// For getting the output from req.body(it will parse the upcoming request to String or Arrays).
app.use(express.urlencoded({ extended: true }));
// For using the file in assets folder.
app.use(express.static('./assets'));


// Setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(expressLayout);

// It creates a session cookie and stores it in the browser and
//mongo store is used to store the session cookie in the db 
app.use(session({
    name: "ERSystem",//name of cookie

    //whenever an encryption happen there is a key to encode and decode
    //so secret is the key for encryption
    secret: "nZr4u7x!A%D*G-KaNdRgUkXp2s5v8y/B?E(H+MbQeThVmYq3t6w9z$C&F)J@NcRfUjXnZr4u7x!A%D*G-KaPdSgVkYp3s5v8y/B?E(H+MbQeThWmZq4t7w9z$C&F)J@N",
    saveUninitialized: false,//user has not yet login -> is case me cookie to store hoga nahi islie false
    resave: false,//pahle se hi session cookie me store h, to baar baar to nahi rewrite kroge, islie false
    cookie: { // how long this cookie is valid afetr that this cookie is envalid/expire
        maxAge: (1000 * 60 * 100) 
    },
    // When you use connect-mongo with express-session, it creates a collection 
    // called sessions in the specified MongoDB database and stores the session 
    // data as documents in that collection. connect-mongo automatically manages 
    // the expiration of the session data and removes expired sessions from the 
    // sessions collection.
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://kapishverma:MAUEQf9oUOqHESe1@kapish.ag7x6wb.mongodb.net/kapish?retryWrites=true&w=majority',
        autoRemove: 'disabled'
    },// a callback function when connection is not established
        (err) => {
            console.log(err);
        }
    )
}))

// Using passport
app.use(passport.initialize());// This middleware initializes Passport and sets it up to be used in the app.
app.use(passport.session());//It uses the session data stored in the session cookie to authenticate requests.
// It retrieves the user information from the session and attaches it to the req.user object.
app.use(passport.setAuthenticatedUser);

app.use(flash());// Using Connect flash
app.use(flashMiddleWare.setFlash);

// setting up the router, following MVC structure.
app.use('/', require('./routes'));


// Setting up the server at the given port
app.listen(port, (err) => {
    if (err) {
        console.log(`Error is running on server : ${err}`);
        return;
    }
    console.log("{Shree Ganeshay Namah}Server is up and running at port ", + port);
});
