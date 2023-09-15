require("./init_db");
const Product = require("../models/Product");
const Constants = require("../constants");
const Helper = require("../utils/Helper");

const descriptions = [
    "A comfortable seating solution for multiple people, available in various styles and upholstery materials.",
    "The centerpiece of the dining room, offering a gathering place for meals in different shapes and materials.",
    "Provides support for mattresses and comes in various sizes and styles for a comfortable night's sleep.",
    "A storage solution for clothing and accessories with hanging rods and shelves.",
    "A low table for the living room, perfect for holding drinks and decorative items.",
    "A storage and display unit for books, collectibles, and decorative items.",
    "A workspace with various styles and features for studying or working from home.",
    "A bedroom storage piece with multiple drawers for clothing and personal items.",
    "A comfortable and adjustable seating option for relaxation.",
    "Tall chairs designed for seating at bars or high countertops, available in different styles.",
    "Furniture designed for outdoor living spaces, including tables and chairs.",
    "A dining room storage piece with cabinets and serving surface for dishes."
  ];

function getRandomNumberInRange(a,b) {
    // Ensure that 'a' is the smaller number and 'b' is the larger number
    // let a = 1;
    // let b = 14;
    if (a > b) {
      [a, b] = [b, a];
    }
  
    // Calculate the random number within the range [a, b]
    const randomNumber = Math.random() * (b - a + 1) + a;
    let ranNum = Math.floor(randomNumber);
    // Use Math.floor to round down to the nearest integer
    if(ranNum === 5) {
        return ranNum + ".jpg";
    }
    else {
        return ranNum + ".png";
    }
  }
  function getRandomNumberForWeight(a,b) {
    // Ensure that 'a' is the smaller number and 'b' is the larger number
    // let a = 1;
    // let b = 14;
    if (a > b) {
      [a, b] = [b, a];
    }
  
    // Calculate the random number within the range [a, b]
    const randomNumber = Math.random() * (b - a + 1) + a;
    let ranNum = Math.floor(randomNumber);
    // Use Math.floor to round down to the nearest integer
        return ranNum;
  }

var trendingProducts= [
    {
        "_id": "6354vag95c1cb8ee67e52c19",
        "name": "Amptron table",
        "display_pic": "../assets/productPics/image 10.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "635v3b6a5c1cbmee67e52ca9",
        "name": "Enerdrive table",
        "display_pic": "../assets/productPics/image 8.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543bdv5c1cb8ee6ae52cf1",
        "name": "Evakool table",
        "display_pic": "../assets/productPics/image 7.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543cv75c1cb8ees7e52d2d",
        "name": "Solarking table",
        "display_pic": "../assets/productPics/image 5.jpg",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543cv85c1cbmee67e52d69",
        "name": "Satking table",
        "display_pic": "../assets/productPics/image 9.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543a795c1cbveej7e52c39",
        "name": "chair1 table",
        "display_pic": "../assets/productPics/image 10.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543b6a5c14bxev67e52ca9",
        "name": "Enerdrive table 1",
        "display_pic": "../assets/productPics/image 8.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543b4b5c1vb8eed7e52cf1",
        "name": "Evakool table 1",
        "display_pic": "../assets/productPics/image 7.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "635433375c1cb8ee6vef2d2d",
        "name": "Solarking table 2",
        "display_pic": "../assets/productPics/image 5.jpg",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543c885c1cb2een7v52d69",
        "name": "Satking table 2",
        "display_pic": "../assets/productPics/image 9.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63843b6a5c14b8vej7e52ca9",
        "name": "Enerdrive table 3",
        "display_pic": "../assets/productPics/image 8.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543b4b5t1cbv8eeh7e529f1",
        "name": "Evakool table 3",
        "display_pic": "../assets/productPics/image 7.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543337vc1cv8eef7e52d2d",
        "name": "Solarking  table 3",
        "display_pic": "../assets/productPics/image 5.jpg",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    },
    {
        "_id": "63543c885c1cb2e767e52v69",
        "name": "Satking table 3",
        "display_pic": "../assets/productPics/image 9.png",
        "price": 999,
        "offer_price": 899,
        "rating": 1
    }
]

function getRandomNumber(a, b) {
    // Generate a random number between a and b (inclusive)
    const randomNumber = Math.random() * (b - a + 1) + a;
    
    // Check if the number should be a whole number or end with .5
    if (randomNumber % 1 === 0) {
      // It's a whole number
      return randomNumber;
    } else {
      // It's a decimal, round it to the nearest .5
      return Math.round(randomNumber * 2) / 2;
    }
  }
// console.log(trendingProducts);

function randomizeCost() {
    const min = 200;
  const max = 1000;

  // Generate a random number between 0 (inclusive) and 1 (exclusive)
  const randomFraction = Math.random();

  // Scale the random fraction to the desired range [min, max]
  const randomNumber = Math.floor(randomFraction * (max - min + 1)) + min;

  const offerMax = randomNumber - 1;
  const offerMin = randomNumber - 100;

  const randomOfferNumber = Math.floor(randomFraction * (offerMax - offerMin + 1)) + offerMin;

  const weight = Math.floor(randomFraction * (101));
  var data = {price:randomNumber, offer_price : randomOfferNumber, weight: weight};
//   console.log(data);
  return data;
}

async function execute() {
    await trendingProducts.forEach(async (item) => {
        let priceData = await randomizeCost();
        item.category = "650206544cd21ffda2da7ddf",
        item.weight = getRandomNumberForWeight(1,30),
        item.total_qty = getRandomNumberForWeight(10,40),
        item.price = priceData.price,
        item.offer_price = priceData.offer_price
        item.sku_code = generateSKU(item.name, "trendingProducts"),
        item.rating = getRandomNumber(3,5);
        item.is_active = true;
        item.description = descriptions[Math.floor(Math.random() * descriptions.length)];
        item.tags = [item.name];
        item.display_pic = Constants.PRODUCT_PICS_S3_BUCKET_URL + getRandomNumberInRange(1, 14);
        delete item._id;
    })
    console.log(trendingProducts);
	 Product.insertMany(trendingProducts)
        .then(function(mongooseDocuments) {
            console.log(mongooseDocuments);
        })
        .catch(function(err) {
            console.log(err);
        });
}

execute();
function generateSKU(productName, category) {
    // Generate a timestamp to add uniqueness
    const timestamp = Date.now().toString(36);
  
    // Generate a random string (e.g., for additional uniqueness)
    const randomString = Math.random().toString(36).substring(2, 8);
  
    // Create the SKU by combining elements
    const sku = `${category.slice(0, 3).toUpperCase()}-${productName.slice(0, 3).toUpperCase()}-${timestamp}-${randomString}`;
  
    return sku;
  }