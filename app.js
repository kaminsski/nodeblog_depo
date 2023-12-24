const path = require("path")
const express = require("express")
const { engine } = require ('express-handlebars');
const mongoose = require("mongoose")
var bodyParser = require('body-parser')
const fileUpload = require("express-fileupload")
const genarateDate = require("./helpers/genarateDate").genarateDate
const limit = require("./helpers/limit").limit
const truncate = require("./helpers/truncate").truncate


const expressSession = require("express-session")
const MongoStore = require("connect-mongo")
const methodOverride = require("method-override")

const app = express()
const port = 3000
const hostname = "127.0.0.1"

mongoose.connect("mongodb://127.0.0.1/nodeblog_db")



const store = MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1/nodeblog_db", // Update this with your MongoDB connection string
});

app.use(methodOverride("_method"));


app.use(expressSession({
    secret:"testo",
    resave: false,
    saveUninitialized: true,
    store: store

}))



app.use(fileUpload())

app.use(express.static("public"))

app.use(methodOverride("_method"))


app.engine('handlebars', engine({helpers:{genarateDate:genarateDate, limit:limit, truncate:truncate}}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use((req,res,next)=>{
    const{userId} = req.session
    if(userId){
        res.locals = {
            displayLink: true
        }
    }else{
        res.locals = {
            displayLink: false
    }
}next()})

app.use((req,res,next)=>
{
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

const main = require("./routes/main")
const posts = require("./routes/posts")
const users = require("./routes/users")
const admin = require("./routes/admin/index")


app.use("/", main)
app.use("/posts", posts)
app.use("/users", users)
app.use("/admin", admin)



app.listen(port, hostname, () => {
    console.log(`Konsol , http://${hostname}:${port}/`)
})