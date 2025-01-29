const {getEndPointInfo,
    getTopicsFromDb,
    getArticlesById,
    getArticles,
    getCommentsById,
    commentPostById,
    updateVote}= require("../models/models")

exports.endPointInfos =(req,res,next) =>{
   const endpoints =  getEndPointInfo()
    
        res.status(200).json({endpoints})
    
    .catch((error)=>{
        next(error)
    })
}

exports.allTopicsResponse = (req,res,next) =>{
    getTopicsFromDb()
    .then((topics)=>{
        res.status(200).json({topics})
    })
    .catch((error)=>{
        next(error)
    })
}

exports.articleInDbById = (req,res,next)=>{
    const articleId = req.params.article_id
    getArticlesById(articleId)
    .then ((article)=>{
        res.status(200).json({article})
    })
    .catch((error)=>{
      next(error)
    })
  }

  exports.allArticles = (req,res,next)=>{
    getArticles()
    .then((article)=>{
        res.status(200).json({article})

    })
    .catch((error)=>{
        next(error)
    })
  }

  exports.getCommentWithId = (req,res,next)=>{

    const commentId = req.params.article_id

    console.log(commentId, " id in controller "
        
    )
    getCommentsById(commentId)
    .then((comment)=>{
        res.status(200).json({comment})
    })
    .catch((error)=>{
        next(error)
    })
  }

  exports.commentsById = (req,res,next)=>{
  
    const id = req.params.article_id
    const author = req.body.username
    const body = req.body.body
  
    commentPostById(id,author,body)
    .then((comment)=>{
        res.status(201).json({comment})
    })
    .catch((error)=>{
        next(error)
    })}


exports.votesUpdate= (req,res,next) =>{
    const id = req.params.article_id
    const vote = req.body.votes

    updateVote(vote,id)
    .then((votes)=>{
        
        res.status(200).json({votes})

     
    
    })
    .catch((error)=>{
        next(error)
    })
}
  


