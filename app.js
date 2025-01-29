const express = require("express")
const app = express()

const {endPointInfos,
    allTopicsResponse, 
    articleInDbById,
    allArticles,
    getCommentWithId,
    commentsById,
    votesUpdate,
    commentToDelete,
    allUsersInDb} = require("./controller/controllers")

app.use(express.json())

app.get("/api",endPointInfos)

app.get("/api/topics",allTopicsResponse)

app.get("/api/articles/:article_id",articleInDbById)

app.get("/api/articles",allArticles)

app.get ("/api/articles/:article_id/comments",getCommentWithId)

app.post("/api/articles/:article_id/comments",commentsById)

app.patch("/api/articles/:article_id",votesUpdate)

app.delete("/api/comments/:comment_id",commentToDelete)

app.get("/api/users", allUsersInDb)



app.use((error,req,res,next) =>{

    if (error.code ===  '22P02') {
        res.status(404).json({msg:"Invalid Id Input, Id must be an Integer"})
    }

    if (error.status && error.msg ) {
        res.status(error.status).json({msg:error.msg})
    }

    next(error)

})

app.use((err,req,res,next)=>{
    console.log(err, " this error has not been handled yet")
})


app.all("*", (req,res)=>{
    res.status(404).json({ msg: "Path not found" });
})


module.exports = app