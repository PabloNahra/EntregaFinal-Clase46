import { Router } from "express";
import { mockGenerateProducts } from "../controllers/mock.controller.js";
import { checkRolAdmin } from "../middlewares/auth.js";

const mockRoutes = Router()

mockRoutes.get('/mockingproducts', checkRolAdmin, mockGenerateProducts)
//mockRoutes.get('/mockingproducts', mockGenerateProducts)


export default mockRoutes