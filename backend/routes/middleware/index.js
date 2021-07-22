
const jwt = require('jsonwebtoken')
var middlewareObj = {};
middlewareObj.auth = function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      //console.log(user);
      //console.log(err)
      if (err) return res.sendStatus(403)
      if(req.params.username && req.params.username!==user.username)
       return res.sendStatus(401)
        
      req.user = user
      next()
    })
    
}

module.exports = middlewareObj;