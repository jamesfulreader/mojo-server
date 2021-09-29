const { createClient } = require("@supabase/supabase-js")
const bcryptjs = require("bcryptjs")
const dotenv = require("dotenv")

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
  const salt = await bcryptjs.genSalt(10)
  const hash = await bcryptjs.hash(password, salt)

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
