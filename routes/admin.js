const express = require('express');
const routes = express.Router();
const admin = require('../models/admin');
const adminControl = require('../controllers/admincontrol');
const passport = require('passport');

routes.get("/admin", passport.checkAuth, adminControl.addDetails);

routes.get("/adminData", passport.checkAuth, adminControl.adminData);

routes.post("/adminFormData", admin.uploadImg, adminControl.adminFormData);

routes.get("/viewData", passport.checkAuth, adminControl.viewData);

routes.get("/userData", passport.checkAuth, adminControl.userData);

routes.get('/deleteRecord/:id', adminControl.deleteRecord);

routes.get('/updateRecord/:id', adminControl.updateRecord);

routes.post('/editAdminDetails', admin.uploadImg, adminControl.editAdminDetails);

routes.get('/', adminControl.login);

routes.post('/loginData', passport.authenticate('local', { failureRedirect: '/' }), adminControl.addDetails)

routes.get("/dashboard", passport.checkAuth, (req, res) => {
    return res.render('dashbourd');
})

routes.get('/CheckEmail', adminControl.CheckEmail);

routes.post('/emailCheck', adminControl.emailCheck);

routes.get('/otpCheck', adminControl.otpCheck);

routes.post('/otpEmail', adminControl.otpEmail);

routes.post('/NewPass', adminControl.NewPass);

routes.post('/deleteAll', adminControl.deleteSel);

module.exports = routes;