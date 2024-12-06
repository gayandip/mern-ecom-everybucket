import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const unique =
      Math.floor(Math.random() * 1000) + path.extname(file.originalname);
    cb(null, unique);
  },
});

const upload = multer({ storage });

export { upload };
