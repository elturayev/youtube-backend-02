const {PAGINATION} = require('../../config.js')

const pagination  = (request,response,next)=>{
	
	request.PAGINATION = PAGINATION
	
	return next()
	
}


module.exports = pagination