import path from "path"
import express from "express"
import multer from "multer"

const router = express.Router()

// store the image in the disk of the server
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/")
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  }
})

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/

  // filetypes is the variable declared above
  // all .test() do is it checks whether it match our regular expression
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimetypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error("Images only!"), false)
  }
}

// this is where the real upload happenning
const upload = multer({ storage, fileFilter })
const uploadSingleImage = upload.single("image") // whatever we put in .single() (in this case: "image") is fieldname in file.fieldname (so if we call it "random" then we have file.fieldname = "random") // we make it single because we want to upload a single file, we can upload multiple files as an array (it's a little more advanced, but we can do that)

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message })
    }

    // the actual upload is done by uploadSingleImage so we dont have to do much here, just send a response
    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/${req.file.path}`
    })
  })
})

export default router
