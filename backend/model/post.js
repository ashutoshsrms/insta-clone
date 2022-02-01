const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types

const postSchema=new mongoose.Schema({
    title:{
       type:String,
       required:true 
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{
            type:ObjectId,
            ref:"User"
        }],

        ///comment on post
    comments:[{
                text:String,
                postedBy:{type:ObjectId,ref:"User"} 
    }],

    //who's post
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})

module.exports=mongoose.model("Post",postSchema)