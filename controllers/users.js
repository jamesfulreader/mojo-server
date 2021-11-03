const { createClient } = require("@supabase/supabase-js")
const bcryptjs = require("bcryptjs")
const dotenv = require("dotenv")
const crypto = require("crypto"),
  // argv = require("yargs").argv,
  resizedIV = Buffer.allocUnsafe(16),
  iv = crypto.createHash("sha256").update("myHashedIV").digest()

iv.copy(resizedIV)

dotenv.config({ path: "../config/config.env" })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

exports.getUsers = async (req, res, next) => {
  let { data, error } = await supabase.from("User").select("*")

  if (error) {
    return res.status(400).send({ msg: "no data found" })
  }

  if (data) {
    return res.status(200).json({ data })
  }
}

exports.createUser = async (req, res, next) => {
  let password = req.body.password
  // const salt = await bcryptjs.genSalt(10)
  // const hash = await bcryptjs.hash(password, salt)
  const key = crypto.createHash("sha256").update(process.env.M_KEY).digest()

  const cipher = crypto.createCipheriv("aes256", key, resizedIV)

  const hash = cipher.update(password, "binary", "hex")

  const { data, error } = await supabase.from("User").insert([
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hash,
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

  const key = crypto.createHash("sha256").update(process.env.M_KEY).digest()

  const decipher = crypto.createDecipheriv("aes256", key, resizedIV)

  const pass = decipher.update(password, "hex", "binary")

  let { data, error } = await supabase
    .from("User")
    .select("*")
    .match({ id: userID })

  if (error) {
    return res.status(400).send({ msg: "no data found" })
  }

  if (data) {
    return res.status(200).json({ data, pass })
  }
}

exports.updateUser = async (req, res, next) => {
  let userID = req.params.id

  const key = crypto.createHash("sha256").update(process.env.M_KEY).digest()

  const cipher = crypto.createCipheriv("aes256", key, resizedIV)

  let { data, error } = await supabase.from("User").update({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: cipher,
    username: req.body.username,
  })
}
