const passport = require('passport');
const passLocal = require('passport-local').Strategy;
const admin = require('../models/admin');
const session = require('express-session');

passport.use(new passLocal({
    usernameField: 'email',
}, async function (email, password, done) {
    // console.log(email, password);
    let adminData = await admin.findOne({ email: email });
    if (adminData) {
        if (password == adminData.password) {
            return done(null, adminData);
        }
        else {
            return done(null, false);
        }
    }
    else {
        return done(null, false);
    }
}));

passport.serializeUser(async (user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    let userData = await admin.findById(id);
    if (userData) {
        return done(null, userData);
    }
    else {
        return done(null, false);
    }
});

passport.setAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    return next();

}

passport.checkAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.redirect('/admin');
    }
};

module.exports = passport;