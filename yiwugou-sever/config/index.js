/* 因为在ts文件中支持使用ESM,所以在src文件夹里可以写ESM语法
但在src以外的文件夹不支持所以得使用commonjs语法 */
// module.exports={
	const protocal='http'
	const ip='localhost'
	const port=3000
	const asserts_url='/static'
	const images_url='/static/imgs'
	const avatar_url = '/static/upload'
	export const secreateOrPrivateKey='hello'
// }
// http://localhost:3000/static/imgs/load/carousel02.png
export const defaultPath=`${protocal}://${ip}:${port}${images_url}/`
export const uploadAvatarPath = `${protocal}://${ip}:${port}${avatar_url}/`