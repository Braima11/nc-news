const express = require("express")
const app = express()

const {endPointInfos,
    allTopicsResponse, 
    articleInDbById} = require("./controller/controllers")
const { errorMonitor } = require("supertest/lib/test")

app.use(express.json())

app.get("/api",endPointInfos)

app.get("/api/topics",allTopicsResponse)



app.all("*", (req,res)=>{
    res.status(404).json({ msg: "Path not found" });
})


module.exports = app