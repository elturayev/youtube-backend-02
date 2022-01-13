module.exports = (dateString)=>{
	let time = new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
	let date = new Date(dateString).toLocaleDateString('uz-UZ')
	return `${date} | ${time}`
}