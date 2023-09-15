const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController");
const {
	validateToken: validate,
	validateAdmin: validateAdmin,
} = require("../utils/AuthUtil");
const errorHandler = require("../utils/Helper").asyncErrorHandler;
router.post(
	"/createCategory",
	validateAdmin,
	errorHandler(CategoryController.postCategory)
);
router.patch(
	"/updateCategory",
	validateAdmin,
	errorHandler(CategoryController.updateCategory)
);
router.patch(
	"/category-status",
	validateAdmin,
	errorHandler(CategoryController.updateCategoryStatus)
);
router.get(
	"/categories",
	validateAdmin,
	errorHandler(CategoryController.getAllCategories)
);
router.delete(
	"/category/:id",
	validateAdmin,
	errorHandler(CategoryController.deleteCategory)
);

module.exports = router