const express=require("express");
const router=express.Router();
const isLoggedIn=require("../middleware/isLoggedIn");
const productModel= require("../models/product-model");
const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const {logoutUser} =require("../controllers/authControllers")


router.get('/', (req, res) => {
    let error = req.flash("error"); 
    res.render('index', { error });
});
router.get("/shop",isLoggedIn,async (req,res)=>{
    let products =  await productModel.find();
    let success= req.flash("success");
    res.render("shop",{ products, success });
});
router.get("/addtocart/:productid",isLoggedIn,async (req,res)=>{
    let user =  await userModel.findOne({email:req.user.email});
    user.cart.push(req.params.productid);
     await user.save();
     req.flash("success","Added to cart");
     res.redirect("/shop");
});

router.get("/cart",isLoggedIn,async (req,res)=>{
    let user =  await userModel.findOne({email:req.user.email}).populate("cart");
    let bill = user.cart.reduce((total, item) => total + item.price - item.discount, 20); // Calculate total bill including platform fee
    res.render("cart",{ user,bill});
});


router.post('/checkout', (req, res) => {
    res.redirect("/checkout");
});

router.get("/checkout",isLoggedIn,async (req,res)=>{
    res.render("checkout");
});


router.get("/logout",logoutUser,isLoggedIn,(req,res)=>{
    res.redirect("/")
});

module.exports=router;

