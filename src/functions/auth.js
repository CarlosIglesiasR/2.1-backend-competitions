const jwt = require ('jsonwebtoken');
exports.ensureToken = (req, res, next) =>{
    try {
        const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader!=='undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;

            jwt.verify(req.token, 'my_secret_key_116659KEY', (err, data) =>{
                if(err){
                    res.sendStatus(403)
                } else{
                    next();
                }

            })
        }else{
            res.sendStatus(403);
        }  
    } catch (error) {
        console.log(error);
    }

}