import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) 
        return res.status(401).json({error: 'Access Denied, no token provided'})
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) 
            return res.status(403).json({error: 'Invalid Token'});

        req.user = user;
        next();
    })
}

export default authenticateToken;