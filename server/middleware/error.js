export const error = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    res.status(400).json({
        success:false,
        message:message
    })
  }else{
    res.status(err.statusCode).json({
        success:false,
        message: err.message,
    })
  }

}