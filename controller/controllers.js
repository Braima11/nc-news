const {getEndPointInfo,getTopicsFromDb,getArticlesById}= require("../models/models")

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
  
  


