import { Command } from 'commander'
import { getVariables } from '../../config/config.js'

export let Mocks

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()

const { persistence } = getVariables(options)

switch (persistence) {
    case 'MONGO':
        const {default: MockMongo} = await import('../mongo/MockManagerMongo.js')
        Mocks = MockMongo
        break;

    default:
        break;
}