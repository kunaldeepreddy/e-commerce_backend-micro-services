const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const CategoryController = require("../controllers/CategoryController");
const {
	validateToken: validate,
	validateAdmin: validateAdmin,
} = require("../utils/AuthUtil");
const errorHandler = require("../utils/Helper").asyncErrorHandler;
// const OffersController = require("../controllers/OffersController");

router.post("/createProduct", validateAdmin, errorHandler(ProductController.createProduct));
router.patch("/update", validateAdmin, errorHandler(ProductController.updateProduct));
router.patch(
	"/status",
	validateAdmin,
	errorHandler(ProductController.updateProductStatus)
);
router.get(
	"/all/:page_no/:page_size",
	validateAdmin,
	errorHandler(ProductController.getProducts)
);
router.delete(
	"/:id",
	validateAdmin,
	errorHandler(ProductController.deleteProduct)
);

router.post(
	"/saveOrUpdateRating",
	validate,
	errorHandler(ProductController.saveOrUpdateRating)
);

router.get(
	"/getRatingAndReviews/:product_id/:page_no/:page_size",
	validate,
	errorHandler(ProductController.getRatingAndReviews)
);

router.post(
	"/addCarouselProduct",
	validateAdmin,
	errorHandler(ProductController.addCarouselProduct)
);

router.get(
	"/userConfig",
	errorHandler(ProductController.userPanelLandingPage)
);

// router.post("/offer", validateAdmin, errorHandler(OffersController.addOffer));
// router.patch(
// 	"/offer",
// 	validateAdmin,
// 	errorHandler(OffersController.updateOffer)
// );
// router.patch(
// 	"/offer-status",
// 	validateAdmin,
// 	errorHandler(OffersController.updateOfferStatus)
// );
// router.delete(
// 	"/offer/:id",
// 	validateAdmin,
// 	errorHandler(OffersController.deleteOffer)
// );
// router.get(
// 	"/offers",
// 	validateAdmin,
// 	errorHandler(OffersController.getAllOffers)
// );
// router.get(
// 	"/offers/entities",
// 	validateAdmin,
// 	errorHandler(OffersController.getEntitiesMetadata)
// );
// router.get(
// 	"/offers/getProductOffers/:product_id",
// 	errorHandler(OffersController.getProductOffers)
// );

module.exports = router;
