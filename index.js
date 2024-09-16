const express = require('express');
const port = 8080;
const app = express();
const path = require('path');
const db = require('./confiq/mongoose');
const admin = require('./models/admin');
const fs = require('fs');
const cookie = require('cookie-parser');
const passport = require('passport');
const passLocal = require('./confiq/passwpord_loc');
const session = require('express-session');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'assets')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded());

app.use(cookie());

app.use(session({
    name: 'rnw',
    secret: 'rnw',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 100,
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuth);

app.use("/admin", require('./routes/admin'));
app.use("/", require('./routes/home'))

app.listen(port, function (err) {
    if (err) {
        console.log("something wrong");
        return false;
    }
    console.log("server is ready on", port);
});