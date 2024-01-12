/* const asyncHandlers = (reqHandler) => async (req,res,next)=>{
try{
 await  reqHandler(req,res,next)
}
catch(error)
{
    res.send(err.code||500).json({success:false , message:error.message})
}

} 
 */
 
const asyncHandlers = (requestHandler) =>
{
async(req,res,next)=>{
  return  Promise.resolve(requestHandler(req,res,next)).catch(err=>next(err))
}
}


