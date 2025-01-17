const express=require("express")
const bodyParser=require("body-parser")
const router=require("./router/router.js")
const dotenv=require('dotenv');
const app=express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
const PORT=process.env.PORT;

app.get("/api",router);

app.listen(PORT,()=>{
    console.log(`sever is running on PORT : ${PORT}`)
})