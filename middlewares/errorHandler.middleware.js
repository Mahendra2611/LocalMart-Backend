export const errorHander = (error,req,res,next)=>{
   console.error(error)
    let errorId = error.statusCode || 500;
    let errorMessage = error.message || "Internal Server Error"
    res.status(errorId).json({error:errorMessage})
}