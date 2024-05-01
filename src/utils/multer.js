import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationFolder = 'public/img';
      if (file.originalname.startsWith("profile")) {
        destinationFolder = "public/img/profiles";
      } else if (file.originalname.startsWith("product")){
        destinationFolder = "public/img/products";
      } else if (file.originalname.startsWith("identity")){
        destinationFolder = "public/img/documents/identificacion";
      } else if (file.originalname.startsWith("comp_domicilio")){
      destinationFolder = "public/img/documents/comp_domicilio";
      } else if (file.originalname.startsWith("comp_estado_cta")){
      destinationFolder = "public/img/documents/comp_estado_cuenta";
      }
      cb(null, destinationFolder)
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + file.originalname.replace(/\s+/g, '')
        cb(null, filename)
    }
})

export const uploader = multer({storage})