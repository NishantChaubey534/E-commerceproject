const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, fullname, password } = req.body;


        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash('error', 'You already have an account');
            return res.redirect('/');
        }


        bcrypt.genSalt(10, async (err, salt) => {
            if (err) {
                console.error(err.message);
                req.flash("error", "server error");
                return res.redirect('/');
            }

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    console.error(err.message);
                    req.flash("error", "server error");
                    return res.redirect('/');
                }


                try {
                    let newUser = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });


                    let token = generateToken(newUser);
                    res.cookie("token", token);
                    req.flash("error", "User registered successfully");
                    return res.redirect('/');
                } catch (creationErr) {
                    console.error(creationErr.message);
                    req.flash("error", "Error creating user");
                    return res.redirect('/');
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        req.flash("error", "Server error");
        return res.redirect('/');
    }
};

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    try {

        let user = await userModel.findOne({ email: email });
        if (!user) {
            req.flash("error", "Email or password is incorrect");
            return res.redirect('/');
        }


        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err.message);
                req.flash("error", "Server Error");
                return res.redirect('/');
            }

            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);
                res.redirect("/shop");
            } else {
                req.flash("error", "Email or password is incorrect");
                return res.redirect('/');
            }
        });
    } catch (err) {
        console.error(err.message);
        req.flash("error", "Server Error");
        return res.redirect('/');
    }
};

module.exports.logoutUser = async function (req, res) {
    res.clearCookie('token');
    res.redirect("/");
};

