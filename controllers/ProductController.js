const { Product, Category, HomeCarouselProducts } = require("../models/Models");
const Helper = require("../utils/Helper");
const StorageUtil = require("./../utils/StorageUtil");

module.exports = {
  createProduct: async (req, res) => {
    let data = req.body;
    if (
      !data.name ||
      !data.sku_code ||
      !data.weight ||
      !data.price ||
      !data.offer_price ||
      !data.category ||
      // !data.supplier ||
      !data.total_qty ||
      !data.tags ||
      !req.files ||
      !req.files.display_pic
    ) {
      return res.status(400).json({
        status: false,
        message: res.__("params_missing"),
      });
    }
    data.weight = parseFloat(data.weight);
    data.price = parseFloat(data.price);
    data.offer_price = parseFloat(data.offer_price);
    data.total_qty = parseInt(data.total_qty);
    data.tags = data.tags.split(",").map((tag) => tag.trim());
    let category = await Category.findById(data.category).lean();
    if (!category) {
      return res.status(404).json({
        status: false,
        message: res.__("invalid_request"),
      });
    }
    data.ancestors = [];
    data.ancestors.push(category._id);
    let image = req.files.display_pic;
    let result = await StorageUtil.uploadImage(
      Helper.getProductImageName(image.name),
      image.data,
      image.mimetype
    );
    data.display_pic = result.Location;
    if (req.files.images) {
      let images = [];
      let new_images = [];
      if (Array.isArray(req.files.images)) new_images = req.files.images;
      else new_images.push(req.files.images);
      for (let i = 0; i < new_images.length; i++) {
        let image = new_images[i];
        let res = await StorageUtil.uploadImage(
          Helper.getProductImageName(image.name),
          image.data,
          image.mimetype
        );
        images.push(res.Location);
      }
      data.images = images;
    }
    let product = await new Product(data).save();
    return res.status(201).json({
      status: true,
      message: res.__("added"),
      data: product,
    });
  },

  updateProduct: async (req, res) => {
    let data = req.body;
    if (
      !data.product_id ||
      !data.name ||
      !data.sku_code ||
      !data.weight ||
      !data.price ||
      !data.offer_price ||
      !data.category ||
      // !data.supplier ||
      !data.total_qty ||
      !data.tags ||
      !data.display_pic ||
      !data.images
    ) {
      return res.status(400).json({
        status: false,
        message: res.__("params_missing"),
      });
    }
    let product = await Product.findById(data.product_id).lean();
    if (!product) {
      return res.status(404).json({
        status: false,
        message: res.__("invalid_request"),
      });
    }
    data.weight = parseFloat(data.weight);
    data.price = parseFloat(data.price);
    data.offer_price = parseFloat(data.offer_price);
    data.total_qty = parseInt(data.total_qty);
    data.images = data.images.split(",").map((image) => image.trim());
    data.tags = data.tags.split(",").map((tag) => tag.trim());
    if (product.category != data.category) {
      let category = await Category.findById(data.category).lean();
      if (!category) {
        return res.status(404).json({
          status: false,
          message: res.__("invalid_request"),
        });
      }
      data.ancestors = category.ancestors;
      data.ancestors.push(category._id);
    }
    if (req.files && req.files.new_display_pic) {
      let image = req.files.new_display_pic;
      let result = await StorageUtil.uploadImage(
        Helper.getProductImageName(image.name),
        image.data,
        image.mimetype
      );
      data.display_pic = result.Location;
    }
    if (req.files && req.files.new_images) {
      let images = [];
      if (data.images) images = data.images;
      let new_images = [];
      if (Array.isArray(req.files.new_images))
        new_images = req.files.new_images;
      else new_images.push(req.files.new_images);
      for (let i = 0; i < new_images.length; i++) {
        let image = new_images[i];
        let res = await StorageUtil.uploadImage(
          Helper.getProductImageName(image.name),
          image.data,
          image.mimetype
        );
        images.push(res.Location);
      }
      data.images = images;
    }
    let record = await Product.findByIdAndUpdate(data.product_id, data, {
      new: true,
    });
    return res.status(200).json({
      status: true,
      message: res.__("updated"),
      data: record,
    });
  },

  updateProductStatus: async (req, res) => {
    let data = req.body;
    if (!data.product_id || data.is_active == undefined) {
      return res.status(400).json({
        status: false,
        message: res.__("params_missing"),
      });
    }
    await Product.findByIdAndUpdate(data.product_id, {
      is_active: data.is_active,
    });
    return res.status(200).json({
      status: true,
      message: res.__("updated"),
    });
  },

  getProducts: async (req, res) => {
    const page = parseInt(req.params.page_no);
    const limit = parseInt(req.params.page_size);
    const startIndex = (page - 1) * limit;
    let query = {};
    if (req.query.search) {
      query = {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { tags: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }
    let products = await Product.find(query, "-ancestors -updated_at")
      .populate("category", "name")
      .populate("supplier", "name")
      .sort("-inserted_at")
      .skip(startIndex)
      .limit(limit)
      .lean();
    const total_records = await Product.countDocuments(query);
    return res.json({
      status: true,
      message: res.__("success"),
      data: {
        products: products,
        page_no: page,
        page_size: limit,
        total_pages: Math.ceil(total_records / limit),
      },
    });
  },

  deleteProduct: async (req, res) => {
    let id = req.params.id;
    await Product.findByIdAndDelete(id);
    return res.json({
      status: true,
      message: res.__("deleted"),
    });
  },

  addCarouselProduct: async (req, res) => {
    let data = req.body;
    if (!data.product_id) {
      return res.status(400).json({
        status: true,
        message: res.__("params_missing"),
      });
    }
    let carouselItems = await HomeCarouselProducts.find({
      product: product_id,
    });
    if (carouselItems.length != 0) {
      return res.status(400).json({
        status: true,
        message: res.__("this product is already on carousel list"),
      });
    }
    let productItem = await Product.findById(product_id);
    if (!productItem) {
      return res.status(400).json({
        status: true,
        message: res.__("invalid_request"),
      });
    }
    let new_data = {
      name: productItem.name,
      image: productItem.display_pic,
      description: productItem.description,
      product: data.product_id,
    };
    let record = await new HomeCarouselProducts(new_data).save();
    return res.json({
      status: true,
      message: res.__("added"),
      data: record,
    });
  },

  userPanelLandingPage: async (req, res) => {
    let userConfig = {};
    let homePageProducts = await getHomePageProducts();
    userConfig["Home Page Products"] = homePageProducts || {};
    let carouselPics = await getCarouselPics();
    userConfig["carousel pics"] = carouselPics || [];
    return res.status(200).send({
      status: true,
      message: res.__("data retrived successfully"),
      data: userConfig,
    });
  },
};

async function getCarouselPics() {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await Category.findOne(
        { is_active: true, name: "Carousel Products" },
        "_id name"
      ).lean();
      // console.log("category", category);
      let products = await Product.find({ category: category._id })
        .select(
          "_id name description display_pic category price offer_price sku_code is_active"
        )
        .exec();
      resolve(products)
    } catch (error) {
      console.error("Error querying data:", error);
      reject(error);
    }
  });
}
// .catch((error) => {
//   console.error("Error querying products:", error);
//   return error;
// });
// })
// .catch((error) => {
//   console.error("Error querying categories:", error);
//   return error;
// });

async function getHomePageProducts() {
  return new Promise(async (resolve, reject) => {
    try {
      let categoryNamesToQuery = [
        "Trending Products",
        "BestSeller Products",
        "Special Offer Products",
        "New Arrival Products",
        "Featured Products",
      ];

      const categories = await Category.find({
        name: { $in: categoryNamesToQuery },
      }).select("_id name");

      const categoriesList = categories.map((category) => ({
        name: category.name,
        category_id: category._id,
      }));

      const categoryIdsToQuery = categories.map((category) => category._id);

      const products = await Product.find({
        category: { $in: categoryIdsToQuery },
      }).select(
        "_id name description display_pic category price offer_price sku_code is_active"
      );

      const productListsByCategory = {};
      categoriesList.forEach((categoryItem) => {
        const matchingProducts = products.filter((product) =>
          product.category.equals(categoryItem.category_id)
        );
        productListsByCategory[categoryItem.name] = matchingProducts;
      });

      resolve(productListsByCategory);
    } catch (error) {
      console.error("Error querying data:", error);
      reject(error);
    }
  });
}
// function toCamelCase(str) {
//   return str
//     .replace(/[- ]+/g, " ")
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
//       return index === 0 ? match.toLowerCase() : match.toUpperCase();
//     })
//     .replace(/\s/g, "");
// }

// saveOrUpdateRating: async (req, res) => {
// 	let user_id = req.decoded_data.user_id;
// 	let data = req.body;
// 	if (!data.product_id || !data.rating) {
// 		return res.status(400).json({
// 			status: false,
// 			message: res.__("params_missing"),
// 		});
// 	}
// 	let productRes = await Product.findById(data.product_id).lean();
// 	if (!productRes) {
// 		return res.status(400).json({
// 			status: false,
// 			message: res.__("product not found"),
// 		});
// 	}
// 	else {
// 		let ratingRes = await Rating.findOne({ product: data.product_id, user: user_id }).lean();
// 		if (!ratingRes) {
// 			let obj = {
// 				user: user_id,
// 				product: data.product_id,
// 				rating: data.rating,
// 				review: data.review ? data.review : ''
// 			}
// 			let ratings = await new Rating(obj).save();
// 			if (ratings) {
// 				const total_records = await Rating.countDocuments({ product: data.product_id });
// 				let AverageRating;
// 				if (total_records == 0) {
// 					AverageRating = data.rating;
// 				}
// 				else {
// 					AverageRating = ((productRes.rating * total_records) + data.rating) / (total_records + 1)
// 				}
// 				let record = await Product.findByIdAndUpdate(data.product_id, { rating: roundHalf(AverageRating) }, {
// 					new: true,
// 				});
// 				return res.status(200).json({
// 					status: true,
// 					message: res.__("saved rating successfully"),
// 					data: ratings
// 				});
// 			}
// 			else {
// 				return res.status(400).json({
// 					status: false,
// 					message: res.__("rating saving failed"),
// 				});
// 			}
// 		}
// 		else {
// 			let obj = {
// 				rating: data.rating,
// 				review: data.review ? data.review : ratingRes.review
// 			}
// 			let ratings = await Rating.findOneAndUpdate({ product: data.product_id, user: user_id }, obj, {
// 				new: true,
// 			});
// 			if (ratings) {
// 				const total_records = await Rating.countDocuments({ product: data.product_id });
// 				let AverageRating;
// 				AverageRating = ((productRes.rating * total_records) + data.rating - ratingRes.rating);
// 				AverageRating = AverageRating / (total_records);
// 				let record = await Product.findByIdAndUpdate(data.product_id, { rating: roundHalf(AverageRating) }, {
// 					new: true,
// 				});
// 				return res.status(200).json({
// 					status: true,
// 					message: res.__("saved rating successfully"),
// 					data: ratings
// 				});
// 			}
// 			else {
// 				return res.status(400).json({
// 					status: false,
// 					message: res.__("rating saving failed"),
// 				});
// 			}
// 		}
// 	}
// },

// getRatingAndReviews: async (req, res) => {
// 	let user_id = req.decoded_data.user_id;
// 	let data = req.params;
// 	if (!data.product_id || !data.page_no || !data.page_size) {
// 		return res.status(400).json({
// 			status: false,
// 			message: res.__("params_missing"),
// 		});
// 	}
// 	const page = parseInt(req.params.page_no);
// 	const limit = parseInt(req.params.page_size);
// 	const startIndex = (page - 1) * limit;
// 	let query = {
// 		product: data.product_id
// 	};
// 	let reviews = await Rating.find(query, "user product rating review inserted_at")
// 		.sort("-inserted_at")
// 		.skip(startIndex)
// 		.limit(limit)
// 		.lean();
// 	const total_records = await Rating.countDocuments(query);
// 	return res.json({
// 		status: true,
// 		message: res.__("success"),
// 		data: {
// 			reviews: reviews,
// 			page_no: page,
// 			page_size: limit,
// 			total_pages: Math.ceil(total_records / limit),
// 		},
// 	});
// },

// var roundHalf = function (n) {
// 	return (Math.round(n * 2) / 2).toFixed(1);
// };
