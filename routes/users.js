const express = require("express")
const router = express.Router()
const User = require("../models/Users")

router.get("/register", (req,res) => {
    res.render("site/register")
})
router.post("/register", async (req, res) => {
    req.session.sessionFlash = {
        type: "alert alert-success",
        message: " Başarılı"
    }
    try {
        const user = await User.create(req.body);
        // Handle success, you can redirect or send a response
        res.redirect("/users/login");
    } catch (error) {
        // Handle error, you can render an error page or send a response
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/login", (req,res) => {
    res.render("site/login")
})
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            if (user.password === password) {
                req.session.userId = user._id
                res.redirect("/");
            } else {
                res.redirect("/users/login");
            }
        } else {
            res.redirect("/users/register");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/logout", (req,res) => {
    req.session.destroy(()=>{
        res.redirect("/")
    })
})

module.exports = router