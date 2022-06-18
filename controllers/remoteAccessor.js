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

exports.getAllRemoteAccess = async (req, res, next) => {}

exports.getRemoteAccess = async (req, res, next) => {}

exports.updateRemoteAccess = async (req, res, next) => {}

exports.deleteRemoteAccess = async (req, res, next) => {}
