var express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const JWTHandler = require("../../utils/AuthUtil");
var CONSTANTS = require("../../constants.js");
const i18n = require("i18n");
const path = require("path");
const app = express();
i18n.configure({
  locales: ["en"],
  directory: path.join(__dirname, "./../locales"),
  defaultLocale: process.env.DEFAULT_LOCALE,
  updateFiles: false,
});
app.use(i18n.init);

app.use(JWTHandler.decodeToken);
app.use(upload());
const Logger = require("../../utils/LogUtil");
const cors = require("cors");
mongoose
  .connect(CONSTANTS.DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language"
//   );
//   next();
// });

app.use(
  bodyParser.json({
    parameterLimit: 100000,
    limit: "10mb",
    extended: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(methodOverride());
app.use(cookieParser());
app.use(Logger.logRequest);
app.use(Logger.logResponse);
const router = express.Router();

const {
  validateToken: validate,
  validateAdmin: validateAdmin,
} = require("../../utils/AuthUtil");
const errorHandler = require("../../utils/Helper").asyncErrorHandler;
const UserController = require("../../controllers/ProjectController");
app.use("/api/project", router);

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
	"/addCarouselProduct",
	validateAdmin,
	errorHandler(ProductController.addCarouselProduct)
);

router.get(
	"/userConfig",
	errorHandler(ProductController.userPanelLandingPage)
);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "index.html"));
// });

app.use(function (req, res, next) {
  const err = {
    status: 404,
    message: res.__("api_not_found"),
  };
  next(err);
});

app.use((err, req, res, next) => {
  return res.status(err.status ? err.status : 500).json({
    status: false,
    message: err.message,
  });
});

const port = 8013;

app.get("/", (req, res) => {
  res.send("Hello, Express.js!");
});

app.listen(port, () => {
  console.log(`product server is running on port ${port}`);
});
