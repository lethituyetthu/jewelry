var express = require('express');
var router = express.Router();

var roleModel = require('../models/roleModel')
/* GET home page. */
router.get('/', async function(req, res, next) {

    var datas = await roleModel.find();

    const data = datas.map((e) =>({

        id:e._id,
        name:e.name

    }))

    res.status(200).json(data)

});

module.exports = router;
