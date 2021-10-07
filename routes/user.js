const express = require("express")

const { getUsers, createUser, getUser } = require("../controllers/users")

const router = express.Router()

router.route("/").get(getUsers).post(createUser)

router.route("/:id").get(getUser)

module.exports = router
