const timeConvertation = require('../utils/timeConvertation.js')
const GET = (request,response,next)=>{
	try{
		const {userId} = request.params

		let  users = request.select('users')
		users = users.map(user=>{
			user.usercreateAt = timeConvertation(user.usercreateAt)
			return user
		})
		
		const {page = request.PAGINATION.page, limit = request.PAGINATION.limit} = request.query
		if (userId){
			let user = users.find(user => user.userId == userId)
			delete user.password
			return response.json(user)
		}
		else {
			let user = users.slice(page * limit - limit, limit * page)
			user = user.map(el=>{
				delete el.password
				return el
			})
			return response.json(user)
		}
	}catch(error){
		return next(error)
	}
}

module.exports = {
	GET
}