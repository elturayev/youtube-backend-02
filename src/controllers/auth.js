const { ClientError } = require('../utils/error.js')
const sha256 = require('sha256')
const path = require('path')
const fs = require('fs')
const { sign } = require('../utils/jwt.js')
const LOGIN = (request,response,next)=>{
	try{
		const {username,password} = request.body
		const users = request.select('users')
		let user = users.find(user=> user.username == username && user.password == sha256(password))
		if (!user) throw new ClientError(404,"user not found!")
		return response.json({
			user,
			message: "The user  loggend!",
			token: sign({userId: user.userId, agent: request.headers['user-agent']})
		})

	}catch(error){
		return next(error)
	}
}

const REGISTER = (request,response,next)=>{
	try{

		const {originalname,buffer} = request.file
		const {username,password} = request.body
		let nameImg = originalname.replace(/\s/,'')
		let users = request.select('users')
		let newUser = {
			userId : (users.length ? users[users.length - 1].userId + 1 : 1),
			username,
			password:sha256(password),
			profileImg: '/images/' + Date.now() + nameImg,
			usercreateAt:Date()
		}
		users.push(newUser)
		request.insert('users',users)
		fs.writeFileSync(path.join(process.cwd(),'src','files', 'images',Date.now() + nameImg),buffer)

		response.status(201).json(
			{
				user: newUser,
				message:"User created!",
				token:sign({userId:newUser.userId,agent: request.headers['user-agent']})}
		)
		
	}catch(error){
		return next(error)
	}
}


module.exports = {
	LOGIN,
	REGISTER
}