import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationFolder = 'public/img';
      console.log(file.originalname)
      if (file.originalname.startsWith("profile")) {
        console.log("es profile")
        destinationFolder = "public/img/profiles";
      } else if (file.originalname.startsWith("product")){
        console.log("es product")
        destinationFolder = "public/img/products";
      } else if (file.originalname.startsWith("identity")){
        console.log("es identity")
        destinationFolder = "public/img/documents/identificacion";
      } else if (file.originalname.startsWith("comp_domicilio")){
      console.log("es comp_domicilio")
      destinationFolder = "public/img/documents/comp_domicilio";
      } else if (file.originalname.startsWith("comp_estado_cta")){
      console.log("es comp_estado_cuenta")
      destinationFolder = "public/img/documents/comp_estado_cuenta";
      }
      // cb(null, 'public/img')
      cb(null, destinationFolder)

    },
    filename: (req, file, cb) => {
        const filename = Date.now() + file.originalname.replace(/\s+/g, '')
        cb(null, filename)
    }
})


/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Determinar la carpeta de destino según el nombre del archivo
      let destinationFolder;
      if (file.originalname.startsWith("profile")) {
        destinationFolder = "public/img/profiles";
      } else if (file.originalname.startsWith("product")) {
        destinationFolder = "public/img/product";
      } else {
        // Si el nombre del archivo no coincide con ninguno de los casos anteriores, guardar en una carpeta predeterminada
        destinationFolder = "public/img";
      }
      cb(null, destinationFolder);
    } catch (error) {
      // Manejo de errores
      console.error("Error en la función destination:", error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + file.originalname
    cb(null, filename)
}
});
*/



export const uploader = multer({storage})