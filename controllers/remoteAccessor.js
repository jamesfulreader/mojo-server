const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const { encrypt, decrypt } = require('../config/encryptionHandler')
dotenv.config({ path: '../config/config.env' })

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
)

exports.createRemoteAccess = async (req, res, next) => {}

exports.getAllRemoteAccess = async (req, res, next) => {}

exports.getRemoteAccess = async (req, res, next) => {}

exports.updateRemoteAccess = async (req, res, next) => {}

exports.deleteRemoteAccess = async (req, res, next) => {}
