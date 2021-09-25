const createClient = require("@supabase/supabase-js")

const supabase = createClient(SUPA_URL, SUPA_KEY)

exports.getUsers = async (req, res, next) => {
  let { data, error } = await supabase.from("User").select()

  return res.status(200).json({ data })
}
