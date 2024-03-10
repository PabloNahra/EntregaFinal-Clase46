// import config from "../../config/config.js"
import { Command } from 'commander'
import { getVariables } from '../../config/config.js'

export let Products

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()

const { persistence } = getVariables(options)

console.log("persistence")
console.log(persistence)

switch (persistence) {
    case 'MONGO':
        const {default: ProductMongo} = await import('../mongo/ProductManagerMongo.js')
        Products = ProductMongo
        break;
/*
    case 'FS':
        const {default: ProductFS} = await import('../fs/ProductManagerFS.js')
        Products = ProductFS
        break;
*/
    default:
        break;
}

//export default Products