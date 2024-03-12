import { Command } from 'commander'
import { getVariables } from '../../config/config.js'

export let Tickets

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()

const { persistence } = getVariables(options)

switch (persistence) {
    case 'MONGO':
        const {default: TicketMongo} = await import('../mongo/TicketManagerMongo.js')
        Tickets = TicketMongo
        break;

    default:
        break;
}