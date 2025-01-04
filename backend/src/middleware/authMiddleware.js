import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET;  //Load the JWT secret from enviroment

const authMiddleware = (req, res , next) =>{
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token)
    {
        return res.status(401).json( {message : 'Access Denied . No Token Provided.'})
    }

    try{
        //verify the token
        const decoded = jwt.verify(token , JWT_SECRET);

        //Attach user info to the request
        req.user = decoded;

        next();     //continue to the next middleware or route
    }

    catch(error)
    {
        console.error('Invalid Token:' , error.message);
        res.status(403).json( {message: 'Invalid Token.'});
        
    };;
};

export default authMiddleware;
