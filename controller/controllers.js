const {getEndPointInfo}= require("../models/models")

exports.endPointInfos =(req,res,next) =>{
   const endpoints =  getEndPointInfo()
    
        res.status(200).json({endpoints})
    
    .catch((error)=>{
        next(error)
    })
}

