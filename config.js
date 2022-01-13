require('dotenv').config()

const PORT = process.env.PORT || 5000

const TOKEN_TIME = 60 * 60 * 24

const PAGINATION  = {
	page: 1,
	limit: 10
}

module.exports = {
	PORT,
	PAGINATION,
	TOKEN_TIME
}