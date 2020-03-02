const express = require('express')
const app = express()
const http = require('http').createServer(app);
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

module.exports = {
    app, http
}