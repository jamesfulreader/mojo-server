const express = require('express')

const {
	getRemoteAccess,
	getAllRemoteAccess,
	createRemoteAccess,
	updateRemoteAccess,
	deleteRemoteAccess,
} = require('../controllers/remoteAccessor')

const router = express.Router()

router.route('/').get(getAllRemoteAccess).post(createRemoteAccess)
router
	.route('/:id')
	.get(getRemoteAccess)
	.put(updateRemoteAccess)
	.delete(deleteRemoteAccess)

module.exports = router
