const { createClient } = require("@supabase/supabase-js")
const dotenv = require("dotenv")
const { createCipheriv, randomBytes, createDecipheriv } = require("crypto")

const key = randomBytes(32) // need to have set key
const iv = randomBytes(16) // need to have set IV 
// TODO
// set key and IV so that can cipher decipher a user
const cipher = createCipheriv("aes256", key, iv)
const decipher = createDecipheriv('aes256', key, iv)

dotenv.config({ path: "../config/config.env" })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

exports.getUsers = async (req, res, next) => {
  const { data, error } = await supabase.from("User").select("*")

  if (error) {
    return res.status(400).send({ msg: "no data found" })
  }

  if (data) {
    return res.status(200).json({ data })
  }
}

exports.createUser = async (req, res, next) => {
  let password = req.body.password

  password = cipher.update(password, 'utf8', 'hex') + cipher.final('hex')

  const { data, error } = await supabase.from("User").insert([
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: password,
      username: req.body.username,
    },
  ])

  if (error) {
    return res.status(401).send({ msg: "could not create user" })
  }

  if (data) {
    res.status(201).json({
      msg: "user created successfully",
    })
  }

  next()
}

exports.getUser = async (req, res, next) => {
  let userID = req.params.id
  let password = req.body.password

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .match({ id: userID })

  if (error) {
    return res.status(400).send({ msg: "no data found" })
  }

  if (data) {
    console.log(data)
    console.log(data[0].password)
    password = decipher.update(data[0].password, 'hex', 'utf-8') + decipher.final('utf8')
    return res.status(200).json({ data, password })
  }
}

exports.updateUser = async (req, res, next) => {
  let userID = req.params.id
  let password = req.body.password

  password = cipher.update(password, 'utf8', 'hex') + cipher.final('hex')

  let { data, error } = await supabase.from("User").update({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: password,
    username: req.body.username,
  })
}
