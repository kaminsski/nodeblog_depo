const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const Category = require("../models/Category")
const Users = require("../models/Users")

router.get("/", (req,res) => {
    res.render("site/index")
})
router.get("/admin", (req,res) => {
    res.render("admin/index")
})
router.get("/blog", (req,res) => {

    const postPerPage = 2
    const page = req.query.page || 1

    Post.find({}).lean().populate({path:"author", model:Users}).sort({$natural:-1})
        .skip((postPerPage * page) - postPerPage)
        .limit(postPerPage)
        .then(posts => {

            Post.countDocuments().then(postCount => {
                Category.aggregate([
                    {
                        $lookup:{
                            from: "posts",
                            localField: "_id",
                            foreignField: "category",
                            as: "posts"
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                num_of_posts: {$size: "$posts"}
                            }
                        }
                    
                ]).then(categories=>{
                    res.render("site/blog", {posts:posts, categories:categories, current: parseInt(page), pages: Math.ceil(postCount/postPerPage) })
            })
        

        })
    })
})


router.get("/contact", (req,res) => {
    res.render("site/contact")
})
router.get("/blog-single", (req,res) => {
    res.render("site/blog-single")
})

module.exports = router