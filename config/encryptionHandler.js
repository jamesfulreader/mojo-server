const crypto = require('crypto')
const dotenv = require('dotenv')
dotenv.config({ path: '../config/config.env' })

const encrypt = (password) => {
	const iv = Buffer.from(crypto.randomBytes(16))
	const cipher = crypto.createCipheriv(
		'aes-256-ctr',
		Buffer.from(process.env.M_KEY),
		iv
	)
	const encryptedData = Buffer.concat([
		cipher.update(password),
		cipher.final(),
	])

	return { iv: iv.toString('hex'), password: encryptedData.toString('hex') }
}

const decrypt = (encryption) => {
	const decipher = crypto.createDecipheriv(
		'aes-256-ctr',
		Buffer.from(process.env.M_KEY),
		Buffer.from(encryption.iv, 'hex')
	)

	const decryptedData = Buffer.concat([
		decipher.update(Buffer.from(encryption.password, 'hex')),
		decipher.final(),
	])

	return decryptedData.toString('utf-8')
}

module.exports = { encrypt, decrypt }
