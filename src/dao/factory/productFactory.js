import { Command } from 'commander'
import { getVariables } from '../../config/config.js'

export let Products

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()

const { persistence } = getVariables(options)

switch (persistence) {
    case 'MONGO':
        const {default: ProductMongo} = await import('../mongo/ProductManagerMongo.js')
        Products = ProductMongo
        break;

    default:
        break;
}