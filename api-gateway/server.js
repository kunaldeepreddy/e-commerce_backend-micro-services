const path = require('path');
const gateway = require('express-gateway');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
console.log("env variable"+process.env.SECRET_KEY)
gateway()
  .load(path.join(__dirname, 'config'))
  .run();
