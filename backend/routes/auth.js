const express=require('express')
const router=express.Router();
const User=require('../model/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const requireLogin=require('../middleware/requireLogin')

router.post('/signup',(req,res)=>{
    const{name,email,password}=req.body  //object destucting
    if(!email || !name || !password){
        res.status(422).json({error:"Please Enter All The Details"})
    }else{
        User.findOne({email:email})
            .then(savedUser=>{
                if(savedUser){
                    res.status(422).json({error:"User Alredy Exists"})
                }else{
                    bcrypt.hash(password,12)
                        .then(hasedPassword=>{
                            const user1=new User({
                                name,
                                email,
                                password:hasedPassword
                            })
                            user1.save()
                                .then(user=>{
                                    res.status(200).json({msg:"User Added"})
                                })
                                .catch(err => console.log(err))
                        })
                }
            })
        }
})


router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:"Please Enter Email And Password"})
    }
    User.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser)
                return res.status(422).json({error:"Invalid Email"})
            bcrypt.compare(password,savedUser.password)   //encrypt the password and compare
                .then(doMatch=>{
                    if(doMatch){
                        const token=jwt.sign({id:savedUser._id},JWT_SECRET)
                        const{_id,name,email,followers,following,pic}=savedUser  //object destucting
                        //console.log(savedUser)
                        return res.json({token,user:{_id,name,email,followers,following,pic}})
                    }else{
                        return res.status(422).json({error:"Invalid Password"})
                    }
                })

        })
})

router.get('/protected',requireLogin,(req,res)=>{
    res.send("Protected......");
})


module.exports=router