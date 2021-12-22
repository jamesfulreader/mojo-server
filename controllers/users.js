const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  createHash,
} = require("crypto");
dotenv.config({ path: "../config/config.env" });
const resizedIV = randomBytes(16);
const key = createHash("sha256").update(process.env.M_KEY).digest();
let iv = createHash("sha256").update(process.env.M_IV).digest();

iv.copy(resizedIV);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.getUsers = async (req, res, next) => {
  const { data, error } = await supabase.from("User").select("*");

  if (error) {
    return res.status(400).send({ msg: "no data found" });
  }

  if (data) {
    return res.status(200).json({ data });
  }
};

exports.createUser = async (req, res, next) => {
  let password = req.body.password;
  let encryptPass;
  const cipher = createCipheriv("aes256", key, resizedIV);
  encryptPass = cipher.update(password, "binary", "hex") + cipher.final("hex");

  const { data, error } = await supabase.from("User").insert([
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: encryptPass,
      username: req.body.username,
    },
  ]);

  if (error) {
    return res.status(401).send({ msg: "could not create user" });
  }

  if (data) {
    res.status(201).json({
      msg: "user created successfully",
    });
  }

  next();
};

exports.getUser = async (req, res, next) => {
  let userID = req.params.id;
  let passUnEncrypt = "";
  const decipher = createDecipheriv("aes256", key, resizedIV);

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .match({ id: userID });

  if (error) {
    return res.status(400).send({ msg: "no data found" });
  }

  if (data) {
    passUnEncrypt =
      decipher.update(data[0].password, "hex", "binary") +
      decipher.final("binary");
    return res.status(200).json({ data, passUnEncrypt });
  }
};

exports.updateUser = async (req, res, next) => {
  let userID = req.params.id;
  let password = req.body.password;
  const cipher = createCipheriv("aes256", key, resizedIV);

  password = cipher.update(password, "utf8", "hex") + cipher.final("hex");

  let { data, error } = await supabase.from("User").update({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: password,
    username: req.body.username,
  });
};
