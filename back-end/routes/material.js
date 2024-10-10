var express = require("express");
var router = express.Router();
var multer = require("multer");
var materialModel = require("../models/materialModel");

var path = require("path"); 

// Cấu hình Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Đặt tên tệp tin với timestamp để tránh trùng lặp
  }
});

var upload = multer({ storage: storage });


/* GET home page. */
router.get("/", async function (req, res, next) {
  var datas = await materialModel.find();

  const data = datas.map((e) => ({
    id: e._id,
    name: e.name,
    img: e.img,
  }));
  res.status(200).json(data);
});


router.post("/", upload.single("img"),async function (req,res, next) {
  try {
    const { name } = req.body;
    const img = req.file.filename; // Lấy tên tệp tin được lưu

    // Tạo mới material
    const newMaterial = new materialModel({
      name: name,
      img: img, // Lưu tên file ảnh vào database
    });

    // Lưu vào database
    await newMaterial.save();

    res.status(201).json({ message: "Material đã được thêm thành công", material: newMaterial });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
})

module.exports = router;
