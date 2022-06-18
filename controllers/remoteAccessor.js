const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const { encrypt, decrypt } = require('../config/encryptionHandler')
dotenv.config({ path: '../config/config.env' })

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
)

exports.createRemoteAccess = async (req, res, next) => {
	const password = req.body.password
	const encryptData = encrypt(password)

	const { data, error } = await supabase.from('Remote Desktop').insert([
		{
			password: encryptData.password,
			iv: encryptData.iv,
			comp_name: req.body.comp_name,
			IP_address: req.body.IP_address,
		},
	])

	if (error) {
		return res
			.status(401)
			.send({ msg: 'could not create remote access computer' })
	}

	if (data) {
		res.status(201).json({
			msg: 'remote access computer created',
		})
	}

	next()
}

exports.getAllRemoteAccess = async (req, res, next) => {
	const { data, error } = await supabase.from('Remote Desktop').select('*')

	if (error) {
		return res.status(400).send({ msg: 'no data found' })
	}

	if (data) {
		return res.status(200).json({ data })
	}
}

exports.getRemoteAccess = async (req, res, next) => {
	const remoteAccessID = req.params.id

	const { data, error } = await supabase
		.from('Remote Desktop')
		.select('*')
		.match({ id: remoteAccessID })

	if (error) {
		return res.status(400).send({ msg: 'no data found' })
	}

	if (data) {
		const encryption = {
			password: data[0].password,
			iv: data[0].iv,
		}

		const id = data[0].id
		const compName = data[0].comp_name
		const ipAddress = data[0].IP_address

		const decryptData = decrypt(encryption)

		res.status(201).json({
			id,
			compName,
			ipAddress,
			decryptData,
		})
	}
}

exports.updateRemoteAccess = async (req, res, next) => {}

exports.deleteRemoteAccess = async (req, res, next) => {}
