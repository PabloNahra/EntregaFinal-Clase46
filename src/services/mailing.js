import mailer from 'nodemailer'
import { Command } from 'commander'
import { getVariables } from '../config/config.js'
// import config from '../config/config.js'



const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { mailing } = getVariables(options)

console.log(mailing)

export default class MailingService {
    constructor() {
        this.client = mailer.createTransport({
            service:mailing.SERVICE,
            port: mailing.PORT,
            auth: {
                user: mailing.USER,
                pass: mailing.PASSWORD
            }
        }
        )
    }

    sendSimpleMail = async ({from, to, subject='Sin asunto', html, attachments=[]}) => {
        const result = await this.client.sendMail({from, to, subject, html, attachments})
        return result
    }
}