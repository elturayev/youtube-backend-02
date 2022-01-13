const express = require('express')
const { PORT } = require('../config.js')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(express.json())
app.use(cors())
const modelMiddlewares = require('./middlewares/model.js')
const paginationMiddlewares = require('./middlewares/pagination.js')
const tokenAuth = require('./middlewares/token.js')
app.use(modelMiddlewares)
app.use(paginationMiddlewares)
app.use('/data/files/',express.static(path.join(__dirname,'files')))


const authRouter = require('./routers/auth.js')
const userRouter = require('./routers/user.js')
const videoRouter = require('./routers/video.js')
app.use('/auth',authRouter)
app.use('/users',userRouter)
app.use(tokenAuth)
app.use('/videos',videoRouter)


app.use((error,request,response,next)=>{
	if([400,401,404,413,415].includes(error.status)){
		return response.status(error.status).send(error)
	}else {
		return response.status(500).send('Internal Server Error!')
	}
})



app.listen(PORT, () => console.log(`Backend server is running on http://localhost:${PORT}`))
