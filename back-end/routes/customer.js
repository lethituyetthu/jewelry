var express = require("express");
var router = express.Router();

const customerModel = require("../models/customerModel");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const data = await customerModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error: ", error: error.message });
  }
});

router.get('/', async function (req, res, next) {

  

})
module.exports = router;
