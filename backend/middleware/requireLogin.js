const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const mongoose=require('mongoose')
const User=require('../model/user')

module.exports=(req,res,next)=>{
    const   {authorization}=req.headers;
    if(!authorization){
        return res.status(401).json({error:"You must Be Logged In"})
    }
    const token =authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err)
            return res.status(401).json({error:"Invalid Token"})
        else{
            const {id}= payload
            User.findById(id) 
                .then(userdata=>{
                    req.user=userdata
                    next()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    })
}