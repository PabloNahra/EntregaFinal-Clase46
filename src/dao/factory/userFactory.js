import { Command } from 'commander'
import { getVariables } from '../../config/config.js'

export let Users

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()

const { persistence } = getVariables(options)

switch (persistence) {
    case 'MONGO':
        const {default: UserMongo} = await import('../mongo/UserManagerMongo.js')
        Users = UserMongo
        break;

    default:
        break;
}