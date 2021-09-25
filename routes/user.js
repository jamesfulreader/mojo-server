const express = require("express")

const router = express.Router()

router.route("/").get(getUsers).post(addUser)
