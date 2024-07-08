const jwt = require("jsonwebtoken");

const authenticateMiddleWare = async (req,res ,next) => {
    const token = req.headers.authorization;
 
    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        // const {id,username} = decode;
        // verify if id and username exists in DB here.
        console.log(decode);
        req.user = decode;
        next();
        // console.log(decode);
    } catch (error) {
        return res.status(401).json({message: "Not authorised to access this route"});
    }

}
module.exports = authenticateMiddleWare;