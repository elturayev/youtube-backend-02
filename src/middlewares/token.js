const { ClientError } = require('../utils/error.js')

const { verify } = require('../utils/jwt.js')
module.exports = (request,response,next)=>{
	try{
		if(request.method != 'GET'){
			const { token } = request.headers
			if(!token) throw new ClientError(401,'Token not found!')
			const {userId} = verify(request.headers.token)
			request.userId = userId
		}
		return next()

	}catch(error){
		return next(error)
	}
}