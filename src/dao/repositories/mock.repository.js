// import ProductDTO from "../../dtos/product.dto.js";

export default class MockRepository {
    constructor(dao){
        this.dao = dao
    }

    generateProd = async(cantRegGenerar=1) => {
        const result = await this.dao.genMockProd(cantRegGenerar)
        return result
    }
}