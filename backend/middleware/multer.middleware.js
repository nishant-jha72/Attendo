import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Ensure this folder exists: /public/temp
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      // Giving it a unique name (or keeping original)
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage });