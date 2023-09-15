const express = require("express")
const router = express.Router()

const UserController = require('../controllers/UserController')
// const UserPanelController = require('../controllers/UserPanelController')
const { validateToken: validate, validateAdmin: validateAdmin } = require("../utils/AuthUtil")
const errorHandler = require('../utils/Helper').asyncErrorHandler

router.post("/login", errorHandler(UserController.login));
router.get("/logout", validate, errorHandler(UserController.logout));
router.post(
	"/forgot-password",
	errorHandler(UserController.forgotPassword));
router.post(
	"/registerUser",
	errorHandler(UserController.register));
router.get(
	"/forgot-password/reset",
	errorHandler(UserController.resetPassword));
// router.get("/all/:page/:limit", validateAdmin, errorHandler(UserController.getUsersByPagination))
// router.delete("/:_id", validateAdmin, errorHandler(UserController.deleteAccount))
// router.patch("/:_id/status", validateAdmin, errorHandler(UserController.updateUserAccountStatus))
// router.get("/getUserProfileDetails/:_id/", validate, errorHandler(UserController.getUserProfileDetails))
// router.patch("/updateUserProfile", validate, errorHandler(UserController.updateUserProfile))
// router.patch("/addUserAddress", validate, errorHandler(UserController.addUserAddress))
// router.patch("/removeUserAddress", validate, errorHandler(UserController.removeUserAddress))
// router.patch("/setDefaultUserAddress", validate, errorHandler(UserController.setDefaultUserAddress))

module.exports = router