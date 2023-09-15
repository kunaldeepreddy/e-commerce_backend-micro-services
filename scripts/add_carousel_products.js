// require("./init_db");
// const Product = require("../models/Product");
// const Category = require("../models/Category");
// async function getTrendingProducts() {
//   let categoryNamesToQuery = [
//     "Trending Products",
//     "BestSeller Products",
//     "Special Offer Products",
//     "New Arrival Products",
//     "Featured Products",
//   ];
//   let categoriesList = [];

//   Category.find({ name: { $in: categoryNamesToQuery } })
//     .select("_id name")
//     .exec()
//     .then((categories) => {
//       const categoryIdsToQuery = categories.map((category) => {
//         let object = { name: category.name, category_id: category._id };
//         categoriesList.push(object);
//         return category._id;
//       });
//       Product.find({ category: { $in: categoryIdsToQuery } })
//         .select(
//           "_id name description display_pic category price offer_price sku_code is_active"
//         )
//         .exec()
//         .then(async (products) => {
//           const productListsByCategory = {};
//           await categoriesList.forEach((categoryItem) => {
//             const matchingProducts = products.filter((product) => {
// 				return product.category.equals(categoryItem.category_id);
//             });
//             productListsByCategory[categoryItem.name] = matchingProducts;
//           });
//         //    console.log(productListsByCategory);
//           return productListsByCategory;
//         })
//         .catch((error) => {
//           console.error("Error querying products:", error);
//           return error;
//         });
//     })
//     .catch((error) => {
//       console.error("Error querying categories:", error);
//       return error;
//     });
// }

// async function prod() {
//     let TP = await getTrendingProducts();
//     console.log(TP)
// }

// prod();

require("./init_db");
const Product = require("../models/Product");
const Category = require("../models/Category");

async function getTrendingProducts() {
  return new Promise(async (resolve, reject) => {
    try {
      let categoryNamesToQuery = [
        "Trending Products",
        "BestSeller Products",
        "Special Offer Products",
        "New Arrival Products",
        "Featured Products",
      ];

      const categories = await Category.find({ name: { $in: categoryNamesToQuery } }).select("_id name");

      const categoriesList = categories.map((category) => ({
        name: category.name,
        category_id: category._id,
      }));

      const categoryIdsToQuery = categories.map((category) => category._id);

      const products = await Product.find({ category: { $in: categoryIdsToQuery } }).select(
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

async function prod() {
  try {
    let TP = await getTrendingProducts();
    console.log(TP);
  } catch (error) {
    console.error("Error:", error);
  }
}

prod();
