const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const { encrypt, decrypt } = require('../config/encryptionHandler')
dotenv.config({ path: '../config/config.env' })

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
)

exports.getUsers = async (req, res, next) => {
	const { data, error } = await supabase.from('User').select('*')

	if (error) {
		return res.status(400).send({ msg: 'no data found' })
	}

	if (data) {
		return res.status(200).json({ data })
	}
}

exports.createUser = async (req, res, next) => {
	let password = req.body.password

	const encryptData = encrypt(password)

	const { data, error } = await supabase.from('User').insert([
		{
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			password: encryptData.password,
			username: req.body.username,
			iv: encryptData.iv,
		},
	])

	if (error) {
		return res.status(401).send({ msg: 'could not create user' })
	}

	if (data) {
		res.status(201).json({
			msg: 'user created successfully',
		})
	}

	next()
}

exports.getUser = async (req, res, next) => {
	let userID = req.params.id

	const { data, error } = await supabase
		.from('User')
		.select('*')
		.match({ id: userID })

	if (error) {
		console.log(data)
		return res.status(400).send({ msg: 'no data found' })
	}

	if (data) {
		const encryption = {
			password: data[0].password,
			iv: data[0].iv,
		}
		let firstName = data[0].first_name
		let lastName = data[0].last_name
		let username = data[0].username
		const decryptData = decrypt(encryption)
		res.status(201).json({
			firstName,
			lastName,
			username,
			decryptData,
		})
	}
}

exports.updateUser = async (req, res, next) => {
	let userID = req.params.id

	const { data, error } = await supabase
		.from('User')
		.select('*')
		.match({ id: userID })

	if (error) {
		console.log(data)
		return res.status(400).send({ msg: 'no data found' })
	}

	if (data) {
		const encryptData = encrypt(password)

		update({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			password: encryptData.password,
			username: req.body.username,
			iv: encryptData.iv,
		})
	}
}
