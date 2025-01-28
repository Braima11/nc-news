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



