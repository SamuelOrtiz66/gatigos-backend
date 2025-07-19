const express = require('express');
const nodemailer = require('nodemailer');
const mjml = require('mjml');
const cors = require('cors');
require('dotenv').config(); // ← esto importa .env

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/reserva', async (req, res) => {
  console.log("Reserva recibida:", req.body); // ✅ VERIFICACIÓN

  const { nombre, telefono, nombreMascota, servicio, fecha } = req.body;

  const html = mjml(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px" color="#f45e43" font-family="Helvetica">
              ¡Gracias por tu reserva, ${nombre}!
            </mj-text>
            <mj-text>
              Hemos recibido tu solicitud para el servicio de <strong>${servicio}</strong> para tu mascota <strong>${nombreMascota}</strong> el día <strong>${fecha}</strong>.
            </mj-text>
            <mj-text>Te contactaremos al ${telefono} para confirmar.</mj-text>
            <mj-divider border-color="#ff9800" />
            <mj-text font-size="12px" color="#888">Mundo Mascota Paiporta</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `).html;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Gat i Gos" <${process.env.GMAIL_USER}>`,
    to: 'samuelortizheredia@gmail.com',
    subject: 'Confirmación de reserva',
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reserva enviada correctamente. Te contactaremos pronto.' });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    res.status(500).json({ message: 'Error al enviar el correo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});