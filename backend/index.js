const express=require('express')
const mongoose=require('mongoose')
const {MONGOENDPOINT}=require('./keys')
const app=express()

mongoose.connect(MONGOENDPOINT,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

mongoose.connection.on("connected",()=>{
    console.log("connected with atlas");
})
mongoose.connection.on("error",()=>{
    console.log("error"+err)
})

app.use(express.json())   //midleware
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


const PORT=process.env.PORT || 3000
app.listen(PORT,()=>console.log(`Server is Running at Port ${PORT}`))    