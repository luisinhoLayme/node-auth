import nodemailer, { Transporter } from 'nodemailer'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  htmlBody: string
  attachements?: Attachement[]
}

interface Attachement {
  filename: string
  path: string
}

export class EmailService {

  private transporter: Transporter

  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailPassword: string
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      }
    });
   }

  async sendEmail(options: SendEmailOptions):Promise<boolean> {
    const { to, subject, htmlBody, attachements = [] } = options;

    try {

      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements
      })

      // console.log(sentInformation)
      return true;
    } catch (err) {
      return false;
    }
  }
}
