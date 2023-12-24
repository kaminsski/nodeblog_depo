const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const path = require("path")
const Category = require("../models/Category")
const Users = require("../models/Users")

router.get("/new", (req,res) => {
    if(!req.session.userId){
        return res.render("users/login")
    }else{
        Category.find({}).lean().then(categories=>{
            res.render("site//addpost", {categories:categories})
        })
    }
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) => {
    if (req.query.look) {
        const regex = new RegExp(escapeRegex(req.query.look), 'gi');
        Post.find({ "title": regex }).lean().populate({ path: "author", model: Users }).sort({ $natural: -1 }).then(posts => {
            Category.aggregate([
                {
                    $lookup: {
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
                        num_of_posts: { $size: "$posts" }
                    }
                }
            ]).then(categories => {
                res.render("site/blog", { posts: posts, categories: categories, posts: posts });
            });
        });
    }
});


router.get("/category/:categoryId", (req,res)=>{
    Post.find({category:req.params.categoryId}).lean().populate({path:"category", model:Category}).populate({path :"author", model : Users}).then(posts =>{
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
            res.render("site/blog", {posts:posts, categories:categories})
        })
    })
})

router.get("/:id", (req,res) => {
    
    Post.findById(req.params.id).populate({path :"author", model : Users}).lean().then(post =>{
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
            Post.find({}).lean().populate({path:"author", model:Users}).sort({$natural:-1}).then(posts => {
                res.render("site/blog-single", {post:post, categories:categories, posts:posts})

            })

        })
    })
})

router.post("/test", (req,res) => {

    let post_image = req.files.post_image
    post_image.mv(path.resolve(__dirname, "../public/img/postimages", post_image.name))
    Post.create({
        ...req.body,
        post_image:`/img/postimages/${post_image.name}`,
        author : req.session.userId
    },)

req.session.sessionFlash = {
    type: "alert alert-success",
    message: " Başarılı"
}

    res.redirect("/blog")
})

module.exports = router