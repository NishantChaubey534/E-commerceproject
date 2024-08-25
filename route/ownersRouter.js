//  $env:NODE_ENV="development"
const express = require('express');
const router = express.Router();
const ownerModel = require("../models/owner-model");
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator'); // Ensure correct import
const isLoggedIn = require('../middleware/isLoggedIn');


// if( process.env.NODE_ENV === "development"){
router.get('/create', (req, res) => {
    let errors = req.flash('errors');
    res.render('owner-login', { owner: { fullName: '', email: '' }, errors });
});

router.post('/create', [
    check('fullName').notEmpty().withMessage('Full Name is required'),
    check('email').isEmail().withMessage('Invalid Email Address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('owner-login', {
                owner: req.body,
                errors: errors.array()
            });
        }

        let { fullName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        let createdOwner = await ownerModel.create({
            fullName,
            email,
            password: hashedPassword,
        });

        res.redirect('/owners/admin');
    } catch (error) {
        if (error.code === 11000) { 
            return res.status(400).render('owner-login', {
                owner: req.body,
                errors: [{ msg: 'Email already in use' }]
            });
        }
        res.status(500).send("An error occurred: " + error.message);
    }
});

router.get("/admin",(req, res) => {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

module.exports = router;