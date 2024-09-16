const express = require('express');
const routes = express.Router();
const homeControl = require('../controllers/homeController');

routes.get("/", homeControl.hello);

module.exports = routes;