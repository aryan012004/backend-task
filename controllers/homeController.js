const express = require('express');
const path = require('path');

module.exports.hello = async (req, res) => {
    return res.render('Home/home');
};