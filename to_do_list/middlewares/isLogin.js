module.exports =async(req,res,next)=> {
    const inf=await req.session.userInf;
    console.log(inf);
    if(inf==undefined){
       return res.redirect("/");
    }else{
        next();
    }
}