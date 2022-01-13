const { ClientError } = require('../utils/error.js')
const Joi = require('joi')

const userSchemaRegister = Joi.object({
	username: Joi.string().max(30).alphanum().required(),
	password: Joi.string().min(5).max(15).pattern(new RegExp(/(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*[!@#$%^&*]+)/)).required()
})

const validLogin = (request,response,next)=>{
	try{
		const {username,password} = request.body
		if(!username || !password) throw new ClientError(401,'username and password is required!')
		return next()
	}catch(error){
		return next(error)
	}
}

const validRegister = (request,response,next)=>{
	try{

		const {mimetype,size} = request.file
		const {username,password} = request.body
		const users = request.select('users')

		if(!(username || password)) throw new ClientError(401,'username and password is required!')
		
		let found = users.find(user=> user.username == username)
		if(found)throw new ClientError(400,'This user is available!')

		const  { value, error} = userSchemaRegister.validate(request.body)
		if(error)return next(error)
		if(size > (10 * 1024 * 1024))throw new ClientError(413,'Image size exceeded 10MB!')
		
		if(!['image/jpeg','image/png','image/jpg'].includes(mimetype))throw new ClientError(415,'The image format should be .png or .jpg!')
		return next()

	}catch(error){
		return next(error)
	}
}


const validFileUpload = (request,response,next)=>{
	try{
		const {size,mimetype} = request.file
		let sizeVideo = parseInt((size / 1024 / 1024) + 10)
		const {title} = request.body
		if (title.length > 50) throw new ClientError(400,'Video title More than 50 symbols!')
		if (sizeVideo > 200) throw new ClientError(413,'Video size exceeded 200 MB!')
		if (!['video/mp4'].includes(mimetype)) throw new ClientError(415,'The video file must be in .mp4 format!')

		return next()
	}catch(error){
		return next(error)
	}
}


const validToken = (request,response,next)=>{
	try{
		const users = request.select('users')
		let user = users.find(el=> el.userId == request.userId)
		if(!user) throw new ClientError(404,'Wrong user!')

		return next()
	}catch(error){
		return next(error)
	}
}

module.exports = {
	validLogin,
	validRegister,
	validFileUpload,
	validToken
}