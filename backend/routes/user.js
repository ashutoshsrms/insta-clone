const express=require('express')
const requireLogin=require('../middleware/requireLogin')
const User=require('../model/user')
const Post=require('../model/post')
const router=express.Router()


//all data of login  user
router.get("/user/:id",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
            .populate("postedBy","id name")
            .exec((err,posts)=>{
                if(err){
                    return res.status(422).json({error:err })
                }else{
                    return res.status(200).json({user,posts})
                }
            })
    }).clone().catch(function(err){ console.log(err)})
})

//allready followed msg and only following update
router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        })
    .select("-password")
    .then(result=>res.json(result))
    .catch(err=>console.log(err))
})
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.body._id,{
            $pull:{following:req.user.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>res.json(result))
        .catch(err=>console.log(err))  
    })
})


router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    console.log(req.body)
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true 
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err)
            return res.status(422).json({error:err})
        else
            return res.status(200).json({error:result})
    })
    
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
        .populate("postedBy","_id name")
        .exec((err,post)=>{
            if(err || !post)
                return res.status(422).json({error:err})
            if(post.postedBy._id.toString()=== req.user._id.toString()){
                post.remove()
                    .then(result=>res.json({result}))
                    .catch(error=>console.log(error))
            }else{
                return res.status(422).json({error:"Abey sale You Can't delete another user post"})
            }
        })
})

 //follwing ans followers post
router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})  //$in =>include
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .then(posts=>res.json({posts}))
        .catch(err=> console.log(err))
})

module.exports=router