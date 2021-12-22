const express = require("express");

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
} = require("../controllers/users");

const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser);

module.exports = router;
