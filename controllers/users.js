const { createClient } = require("@supabase/supabase-js")
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
  const { data, error } = await supabase.from("User").insert([
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      username: req.body.username,
    },
  ])

  if (data) {
    res.status(201).json({
      msg: "user created successfully",
    })
  }

  if (error) {
    return res.status(401).send({ msg: "could create user" })
  }
  next()
}
