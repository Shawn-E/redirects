require('dotenv').config();
const express = require('express');
const app = express();
const redirects = require('./redirects.json');
const rateLimit = require("express-rate-limit");

// Rate limiter
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 15,
	standardHeaders: true, 
	legacyHeaders: false,
}))

// Home Page
app.get('', function(req, res){
    log("Client requesting home page")
    res.send('Redirects listening on port ' + port + '!' + "\n \n" + "Available redirects: " + "\n" + JSON.stringify(redirects));
})

// Read redirects from JSON file and create routes
for(const redirect of redirects) {
    if(redirect.alias.length > 1) {
        for(const redirectAlias of redirect.alias) {
            log("Creating redirect: " + redirectAlias + " -> " + redirect.url)
        }
    } else {
        log("Creating redirect: " + redirect.alias + " -> " + redirect.url)
    }
    app.get(redirect.alias, function(req, res){
        log("Client redirecting to: " + redirect.url)
        res.redirect(redirect.url);
    });
}

// Handle invalid redirects
app.get('*', function(req, res){
    log("Invalid redirect: " + req.url)
    res.status(404).send('404 - Invalid redirect alias.');
})

// Listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Redirects listening on port ${port}!`));


function log(msg) {
    if(process.env.DEBUG == "true") console.log(msg)
}