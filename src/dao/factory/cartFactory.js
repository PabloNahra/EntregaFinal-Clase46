import { Command } from 'commander'
import { getVariables } from '../../config/config.js'

export let Carts

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()

const { persistence } = getVariables(options)

switch (persistence) {
    case 'MONGO':
        const {default: CartMongo} = await import('../mongo/CarritoManagerMongo.js')
        Carts = CartMongo
        break;

    default:
        break;
}
