const express=require('express')
const requireLogin=require('../middleware/requireLogin')
const Post=require('../model/post')
const router=express.Router()


router.post("/createPost",requireLogin,(req,res)=>{
    const{title,body,pic}=req.body  //object destucting
    if(!title || !body || !pic)
        return res.status(422).json({error:"Please Fill All The Fields"})
    req.user.password=undefined
    req.user.__v=undefined
    //console.log(req.user)  // which user


    const post=new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save()
        .then(result=>res.json({post:result}))
            .catch(err=>console.log(err))
})


router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
        .populate("postedBy","_id name")
        .then(posts=>res.json(posts))
        .catch(err=>console.log(err))
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name")
        .then(mypost=>res.json({mypost}))
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}},{new:true})
        .populate("postedBy","id name")
        .exec((err,result)=>{
            if(err)
                return res.status(422).json({err})
            else
                return res.json({result})
        })
})


router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}},{new:true})
        .populate("postedBy","id name")
        .exec((err,result)=>{
            if(err)
                return res.status(422).json({err})
            else
                return res.json({result})
        })
} )

module.exports=router;