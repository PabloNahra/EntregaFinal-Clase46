import { productsModel } from "../../models/products.model.js"


export class SessionManager {
    constructor(path){
        this.path = path;
    }

    async get(limit=10, page=1, query='', sort=''){
        try{
            const [code, value] = query.split(':')
            const parseProducts = await productsModel.paginate({[code]: value}, {
                limit, 
                page, 
                sort: sort ? {price: sort} : {}
            })
            parseProducts.payload = parseProducts.docs
            delete parseProducts.docs
            return {message: "OK", ...parseProducts}
        } catch (error){
            return {message: "ERROR", rdo: "No hay productos"}
        }
    }


}


export default SessionManager
