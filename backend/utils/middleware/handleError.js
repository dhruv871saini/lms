function handleError(res,status,messages,data,token){
    return res.status(status).json({message:messages,data:data,cookie:token})
}
export default handleError