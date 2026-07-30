const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !phone || !service || !message) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const htmlEmail = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2a4a7f 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Finanhome</h1>
          <p style="color: #d4a017; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Inmobiliaria</p>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="color: #1a365d; font-size: 20px; margin: 0 0 24px; border-bottom: 2px solid #d4a017; padding-bottom: 12px;">
            Nuevo mensaje de contacto
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #1a365d; width: 140px; vertical-align: top;">Nombre:</td>
              <td style="padding: 10px 0; color: #334155;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #1a365d; vertical-align: top;">Email:</td>
              <td style="padding: 10px 0; color: #334155;"><a href="mailto:${email}" style="color: #2a4a7f;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #1a365d; vertical-align: top;">Telefono:</td>
              <td style="padding: 10px 0; color: #334155;"><a href="tel:${phone}" style="color: #2a4a7f;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #1a365d; vertical-align: top;">Servicio:</td>
              <td style="padding: 10px 0; color: #334155;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #1a365d; vertical-align: top;">Mensaje:</td>
              <td style="padding: 10px 0; color: #334155; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
        </div>

        <div style="background: #f7fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            Inmobiliaria Finanhome | Carrera 56 # 167-29, Bogota DC
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Finanhome Web" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      cc: process.env.CC_EMAIL,
      replyTo: email,
      subject: `Finanhome - ${service} - ${name}`,
      html: htmlEmail
    });

    return res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};
