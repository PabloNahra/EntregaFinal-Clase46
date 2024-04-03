import { Command } from 'commander'
import { getVariables } from '../../config/config.js'

export let Sessions

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()

const { persistence } = getVariables(options)

switch (persistence) {
    case 'MONGO':
        const {default: SessionMongo} = await import('../mongo/SessionManagerMongo.js')
        Sessions = SessionMongo
        break;

    default:
        break;
}