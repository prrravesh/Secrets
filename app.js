require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs =require("ejs");
const encrypt=require("mongoose-encryption")

const app=express();
app.set('view engine',"ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/uaerDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})


const User=mongoose.model("user",userSchema);





app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",function(req,res){
    const user=new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save(function(err){
        if(!err){
            res.render("secrets");
        }
    });
})
app.post("/login",function(req,res){
    email=req.body.username;
    password=req.body.password;
    User.findOne({email:email},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets")
                }
            }
        }
    })
})



app.listen(3000,function(){
    console.log("Server is started on 3000");
})