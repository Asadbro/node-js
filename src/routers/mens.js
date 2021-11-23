import express from "express";
import MenRanking from "../models/mens.js";
import { signin, signup } from "../controllers/users.js";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import auth from "../middlewear/auth.js";
import mens from "../models/mens.js";

// const middleware = (req,res,next) =>{
//     console.log("heloo")
// }

// middleware();


const router = express.Router();
router.get("/mens", paginatedResults(), (req, res) => {
    res.json(res.paginatedResults);
  });
  
function paginatedResults() {
return async (req, res, next) => {
      
    const page = parseInt(req.query.page);

    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    const results = {};
  
 try {
 results.results = await User.find()
    .sort({ _id: 1 })
    .limit(5)
    .skip(skipIndex)
     
     .exec();
    res.paginatedResults = results;
     next();
      } catch (e) {
   res.status(500).json({ message: "Error Occured" });
  }
    };
  }
router.post("/mens",auth, async(req,res) => {
//      const _id = req.params.id;
// if(!_id) return res.json({message: "Unauthenticated"})
    try { 
      const addingMensRecords = new MenRanking(req.body
     
      )   
      console.log(req.body);
 
     const insertMens    = await addingMensRecords.save();
       res.status(201).send(insertMens);
       
   } catch (e) {
        res.status(400).send(e);
        
    }
 });
 router.get("/mens",auth, async(req,res) => {
 
     try {
            const getMens = await MenRanking.find().sort({"ranking": 1});
            console.log("getMens", getMens)
         
        
        res.send(getMens);
    } catch (e) {
         res.status(400).send(e);
         
     }
  });
 
  router.get("/mens/:id",auth, async(req,res) => {
 
     try {
         const _id = req.params.id;
         if(!_id) return res.json({message: "Unauthenticated"})
            const getMen = await MenRanking.findById(_id);
            console.log('Get men result', getMen)
            res.status(201).send(getMen);
        
    } catch (e) {
         res.status(400).send(e);
         
     }
  });
 
  router.patch("/mens/:id", async(req,res) => {
    
     try {
        //  const _id = req.params.id;
        //  if(!_id) return res.json({message: "Unauthenticated"})
         
            const getMen = await MenRanking.findByIdAndUpdate(_id, req.body, {
                new: true
            });
        res.send(getMen);
    } catch (e) {
         res.status(400).send(e);
         
     }
  });
 
  router.delete("/mens/:id", async(req,res) => {
 
     try {
        const _id = req.params.id;
        if(!_id) return res.json({message: "Unauthenticated"})
            const getMen = await MenRanking.findByIdAndDelete(req.params.id);
        res.send(getMen);
    } catch (e) {
         res.status(400).send(e);
         
     }
  });
  
router.post("/reset-password",(req,res) =>{

// crypto.randomBytes(32,(err,buffer)=>{

    //if(err){
        //console.log(err)
    //}
    //const token = buffer.toString("hex")
    //user.findOne({email: req.body.email})
    //.then(user=>{
        //if(!user){
            //return res.status(422).json({error: "user did not exist with that eamil"})
        //}
        //const nodemailer = require("nodemailer");
        
      let transporter = nodemailer.createTransport({
            //host: 'smtp.mailtrap.io',
             service: 'gmail',
             auth: {
                 
                 user: "raoa63227@gmail.com",
                 pass: "walihazia"
             }
     })

     console.log('transporter',transporter)
     
      const  mailOptions = {
        from: "raoa63227@gmail.com",
        to: "asadrao.dev@gmail.com",
        subject: "Subject",
        text: "Rset Password "
   }
  
transporter.sendMail( mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
       console.log('Email sent Successfully to the user: ' + info.response);
    }
  });
    


});


    router.post("/logout",auth, async(req, res)=> {
      console.log(res.user, "ïm here");
    try{
       req.user.tokens = req.user.tokens.filter((currElement) => {
         if(currElement.token !== res.token) return req.token = null;
       })
       
       //res.delete("token");
       //res.clearCookie("token");
        
       
    await req.user.save();
    
      } 
      catch(error){
        res.status(500).send(error)
        }
    });

 

router.post("/sign-in" , signin);
router.post("/sign-up", signup);


 export default router;
