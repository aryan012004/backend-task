const mongoose = require('mongoose');
const multer = require('multer');
const imgPath = ('/uploads');
const path = require('path');
const AdminSheMa = mongoose.Schema({
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: Number,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    hobby: {
        type: Array,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    adminImg: {
        type: String,
        require: true
    }

});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", imgPath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
})
AdminSheMa.statics.uploadImg = multer({
    storage: storage,
}).single("admin");
AdminSheMa.statics.adminModulePath = imgPath;
const admin = mongoose.model('admin', AdminSheMa);
module.exports = admin;