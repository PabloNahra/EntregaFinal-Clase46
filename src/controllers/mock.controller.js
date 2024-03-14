import { mocksServicesRep } from "../dao/repositories/index.js";

export const mockGenerateProducts = async (req, res) => {
  
  // Codeo la cantidad de productos a generar
  const cantRegGenerar=3
  
    try {
      const resultado = await mocksServicesRep.generateProd(cantRegGenerar)
      if(resultado){
        res.send(resultado)
      } else {
        res.status(400).json(resultado)
      }
    } catch (error) {
      res.status(400).json({message: `No podemos generar los productos - ${error}`})
    }
  }

