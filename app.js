const express = require("express")
const app = express()

const {endPointInfos} = require("./controller/controllers")

app.use(express.json())

app.get("/api",endPointInfos)


app.use((err,req,res,next)=>{
    
})


module.exports = app