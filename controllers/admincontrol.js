const express = require('express');
const path = require('path');
const admin = require('../models/admin');
const fs = require('fs');
const nodemailer = require("nodemailer");
const { log } = require('console');

module.exports.addDetails = async (req, res) => {
    return res.redirect('/admin/dashboard');
};

module.exports.adminData = async (req, res) => {
    return res.render('add_admin');
};

module.exports.adminFormData = async (req, res) => {
    var ImagePath = '';
    if (req.file) {
        ImagePath = admin.adminModulePath + "/" + req.file.filename;
    }
    req.body.adminImg = ImagePath;
    let data = await admin.create(req.body);
    return res.redirect('/admin/dashboard');
}

module.exports.viewData = async (req, res) => {
    let search = '';
    if (req.query.search) {
        search = req.query.search;
    }

    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }

    let perPage = 2;

    let data = await admin.find({
        $or: [
            { fname: new RegExp(search, 'i') },
            { lname: new RegExp(search, 'i') },
        ]
    }).limit(perPage).skip(perPage * page);

    let totalDocument = await admin.find({
        $or: [
            { fname: new RegExp(search, 'i') },
            { lname: new RegExp(search, 'i') },
        ]
    }).countDocuments();

    return res.render('view_admin', {
        stData: data,
        search: search,
        totalDocument: Math.ceil(totalDocument / perPage),
        currentPage: page,
    });
};

// user data view -------------------------------------------------------------

module.exports.userData = async (req, res) => {
    let search = '';
    if (req.query.search) {
        search = req.query.search;
    }

    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }

    let perPage = 2;

    let data = await admin.find({
        $or: [
            { fname: new RegExp(search, 'i') },
            { lname: new RegExp(search, 'i') },
        ]
    }).limit(perPage).skip(perPage * page);

    let totalDocument = await admin.find({
        $or: [
            { fname: new RegExp(search, 'i') },
            { lname: new RegExp(search, 'i') },
        ]
    }).countDocuments();

    return res.render('user_admin', {
        stData: data,
        search: search,
        totalDocument: Math.ceil(totalDocument / perPage),
        currentPage: page,
    });
};

// end view user data --------------------------------------------------

module.exports.deleteRecord = async (req, res) => {
    let oldImg = await admin.findById(req.params.id);
    if (oldImg.adminImg) {
        let fullPath = path.join(__dirname, "..", oldImg.adminImg);
        await fs.unlinkSync(fullPath);
    }
    await admin.findByIdAndDelete(req.params.id);
    return res.redirect('back');
};

module.exports.updateRecord = async (req, res) => {
    let record = await admin.findById(req.params.id);
    return res.render('update_admin', {
        stRecord: record,
    });
}

module.exports.editAdminDetails = async (req, res) => {
    let oldData = await admin.findById(req.body.editData);
    if (req.file) {
        if (oldData.adminImg) {
            let fullPath = path.join(__dirname, "..", oldData.adminImg);
            await fs.unlinkSync(fullPath);
        }
        var ImagePath = '';
        ImagePath = admin.adminModulePath + "/" + req.file.filename;
        req.body.adminImg = ImagePath;
    }
    else {
        req.body.ImagePath = oldData.ImagePath;
    }
    await admin.findByIdAndUpdate(req.body.editData, req.body);
    return res.redirect('back');
}

module.exports.login = async (req, res) => {
    return res.render('login');
}

module.exports.loginData = async (req, res) => {
    return res.redirect('/admin');
}

// FORGET PASSWORD CODE

module.exports.CheckEmail = async (req, res) => {
    return res.render('fogetpass/emailcheck');
};

module.exports.emailCheck = async (req, res) => {
    try {
        let checkEmail = await admin.findOne({ email: req.body.email });
        if (checkEmail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                    user: 'anurag253118@gmail.com',
                    pass: 'dehycqoqqepjnrwi'
                }
            });
            var OTP = Math.round(Math.random() * 10000);
            res.cookie('otp', OTP);
            res.cookie('email', checkEmail.email);

            const info = await transporter.sendMail({
                from: 'anurag253118@gmail.com', // sender address
                to: "anurag253118@gmail.com", // list of receivers
                subject: "OTP", // Subject line
                html: `<b>${OTP}</b>`, // html body
            });
            // console.log('send Mail');
            if (info) {
                return res.redirect('fogetpass/otpCheck');
            }
            else {
                return res.redirect('back');
            }
        }
        else {
            console.log('email is not match');
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log('something wrong');
        return res.redirect('back');
    }
};

module.exports.otpCheck = async (req, res) => {
    return res.render('otpCheck');
};

module.exports.otpEmail = async (req, res) => {
    // console.log(req.body.OTP);
    // console.log(req.cookies.otp);
    if (req.body.OTP == req.cookies.otp) {
        // console.log('hi');
        return res.render('fogetpass/veryFive');
    }
    else {
        // console.log('lo');
        return res.redirect('back');
    }
};

module.exports.NewPass = async (req, res) => {
    // console.log(req.body);
    let NewAdmin = await admin.findOne({ email: req.cookies.email });
    // console.log(NewAdmin.email);
    if (NewAdmin.email == req.cookies.email) {
        if (req.body.nPass == req.body.cPass) {
            // console.log('hi');
            await admin.findByIdAndUpdate(NewAdmin.id, { password: req.body.nPass });
            res.clearCookie('otp');
            res.clearCookie('email');
            return res.render('login');
        }
        else {
            return res.redirect('back');
        }
    }
    else {
        return res.redirect('back');
    }
};

module.exports.deleteSel = async (req, res) => {
    await admin.deleteMany({ _id: { $in: req.body.checkDelete } });
    return res.redirect('back');
};