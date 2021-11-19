import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

 const secret = 'test';
 const refreshTokenSecret = 'test';
 export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  console.log("req.body is here", req.body);
 
     try {
       
  const oldUser = await User.findOne({ email });

  if (oldUser) return res.status(400).json({ message: "User already exists" });
 if (password !== confirmPassword){
   res.json({message: "password not match"})
 }
const hashedPassword = await bcrypt.hash(password, 12);
const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 12);

// user.save()
// .then(user => {
//   transporter.sendMail({
//     to: user.email,
//     from: "no-reply asadrao.dev@gmail.com",
//     subject: "signup success",
//     //html:<h1>welcome to website</h1>,
//   })
//   res.json({message: "saved successfully"})
// }).catch(err =>{
//   console.log(err)
// })


const result = await User.create({ email, password: hashedPassword, confirmPassword: hashedConfirmPassword, firstName, lastName });

const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "8h" } );
const refreshToken = jwt.sign({email: result.email, id: result._id },refreshTokenSecret,{expiresIn: "1y" } );
// const response = {
//   "status": "signup",
//   "token": token,
//   "refreshToken": refreshToken,
// }
  res.status(201).json({ result, token, refreshToken});

  } catch (error) {
res.status(500).json({ message: "Something went wrong" });
    
console.log(error);
}
};


    


export const signin = async (req, res) => {
      const { email, password } = req.body;
      try {
      const oldUser = await User.findOne({ email });
       
  if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
 const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

  if (!isPasswordCorrect) return res.json({ message: "Invalid credentials" });
const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "8h" });
//const refreshToken = jwt.sign({email: result.email, id: result._id },refreshTokenSecret,{expiresIn: "1y" } );

 res.status(200).json({ result: oldUser, token});
 console.log("correct password", isPasswordCorrect)
    } catch (err) {
         res.status(500).json({ message: "Something went wrong" });
  }
};




