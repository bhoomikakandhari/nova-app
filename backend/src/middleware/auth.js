const jwt = require("jsonwebtoken");

function requireAuth(req,res,next){
const authHeader= req.headers.authorization;
 
if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({error: "No token provided"});
}

const token = authHeader.split(" ")[1];

try{
    const playload = jwt.verify(token, process.env.jwt_SECRET);
    req.userId = playload.userId;
    next();
}catch(err){
  return res.status(401).json({error : "invalid or expired token"});
}
}

module.exports = requireAuth;