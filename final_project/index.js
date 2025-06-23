const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if session contains auth info
    if (!req.session || !req.session.authorization || !req.session.authorization.accessToken) {
        return res.status(403).json({ error: "User not logged in" });
    }

    const token = req.session.authorization.accessToken;

    // Verify token
    jwt.verify(token, "access", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.user = decoded; // attach decoded token to request
        next(); // auth successful
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
