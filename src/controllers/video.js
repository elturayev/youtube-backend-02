const { ClientError } = require('../utils/error.js')
const path = require('path')
const fs = require('fs')
const timeConvertation = require('../utils/timeConvertation.js')
const GET = (request,response,next)=>{
	try{
		const {videoId} = request.params
		const {search,userId,page = request.PAGINATION.page, limit = request.PAGINATION.limit} = request.query
		let videos = request.select('videos')
		videos = videos.map(video=>{
			video.videocreateAt = timeConvertation(video.videocreateAt)
			return video
		})
		if (videoId){
			let videofilter
			if (videoId == 'all'){
				videofilter = videos.filter(el=> el.userId == request.userId)
			}
			else{
				videofilter = videos.find(video=> video.videoId == videoId)
			}
			response.json(videofilter)
		}
		else {
			let videosAll = videos.slice(page*limit-limit, limit*page)
			if (search || userId){
				let filtered = videosAll.filter(video=> {
					if((search ? (video.videoTitle).includes(search) : true) && (userId ? video.userId == userId : true)){
						return video
					}

				})
				response.json(filtered)
			}
			else {
				response.json(videosAll)
			}
		}
	}catch(error){
		return next(error)
	}
}


const POST = (request,response,next)=>{
	try{
		const {size,originalname,buffer} = request.file
		let sizeVideo = ((size / 1024 / 1024) + 10).toFixed(1)
		let videoname = originalname.replace(/\s/,'')
		const {title} = request.body
		let videos = request.select('videos')
		let newVideo = {
			videoId: (videos.length ? videos[videos.length -1].videoId + 1: 1),
			userId: request.userId,
			videoTitle: title,
			videoLink: '/videos/' + Date.now() + videoname,
			size:sizeVideo,
			videocreateAt:Date()
		}

		videos.push(newVideo)
		request.insert('videos',videos)
		fs.writeFileSync(path.join(process.cwd(),'src','files','videos', Date.now() + videoname),buffer)
		response.status(201).json({message: "Video added!"})

	}catch(error){
		return next(error)
	}
}


const PUT = (request,response,next)=>{
	try{
		const {videoId,title} = request.body
		const videos = request.select('videos')
		let found = videos.find(video => video.videoId == videoId && video.userId == request.userId)
		if(!found) throw new ClientError(401,'Token is invalid!')
		found.videoTitle = title
		request.insert('videos',videos)
		response.status(201).json({message:"Video updated!"})

	}catch(error){
		return next(error)
	}
}

const DELETE = (request,response,next)=>{
	try{

		const { videoId } = request.body
		const videos = request.select('videos')
		let index = videos.findIndex(el=> el.videoId == videoId && el.userId == request.userId)
		if(index == (-1)) throw new ClientError(401,'Token is invalid!')
		let [deleted] = videos.splice(index,1)
		request.insert('videos',videos)
		fs.unlinkSync(path.join(process.cwd(),'src','files',deleted.videoLink))
		response.status(201).json({message:"Video deleted!"})

	}catch(error){
		return next(error)
	}
}



const DOWNLOAD = (request,response)=>{
	response.download(path.join(process.cwd(),'src','files','videos',request.params.videoLink))
}


module.exports = {
	GET,
	POST,
	PUT,
	DELETE,
	DOWNLOAD
}