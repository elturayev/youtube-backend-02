const fs = require('fs')
const path = require('path')

const model = (request,response,next)=>{
	request.select = function (filename){
		let file = fs.readFileSync(path.join(process.cwd(),'src','database', filename + '.json'),'UTF-8')
		file = file ? JSON.parse(file || "[]") : []
		return file
	}
	request.insert = function (filename,data){
		fs.writeFileSync(path.join(process.cwd(),'src','database', filename + '.json'),JSON.stringify(data,null,4))
		return true
	}

	return next()
}


module.exports = model