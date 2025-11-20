import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { Booking, Villa } from '@prisma/client';
import { config } from '../config';
import { calculateNights } from '../utils/date';

const ensureInvoiceFolder = () => {
  if (!fs.existsSync(config.invoiceDir)) {
    fs.mkdirSync(config.invoiceDir, { recursive: true });
  }
};

interface InvoicePayload {
  booking: Booking;
  villa: Villa;
}

export const generateInvoice = async ({
  booking,
  villa,
}: InvoicePayload): Promise<string> => {
  ensureInvoiceFolder();
  const timestamp = dayjs().format('YYYYMMDD_HHmmss');
  const filename = `invoice_${booking.id}_${timestamp}.pdf`;
  const filePath = path.join(config.invoiceDir, filename);

  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc
    .fontSize(24)
    .text('Villa Stay Invoice', { align: 'center' })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Invoice #: ${booking.id}`)
    .text(`Date: ${dayjs().format('DD MMM YYYY')}`)
    .moveDown();

  doc
    .fontSize(16)
    .text('Guest Details', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .text(`Name: ${booking.guestName}`)
    .text(`Phone: ${booking.guestPhone}`)
    .text(`ID / Passport: ${booking.guestID}`)
    .moveDown();

  doc
    .fontSize(16)
    .text('Stay Information', { underline: true })
    .moveDown(0.5);

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  doc
    .fontSize(12)
    .text(`Villa: ${villa.name}`)
    .text(`Check-in: ${dayjs(booking.checkIn).format('DD MMM YYYY')}`)
    .text(`Check-out: ${dayjs(booking.checkOut).format('DD MMM YYYY')}`)
    .text(`Total Nights: ${nights}`)
    .text(`Rate per Night: €${villa.pricePerNight.toFixed(2)}`)
    .moveDown();

  doc
    .fontSize(16)
    .text('Charges', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .text(`Accommodation: €${booking.totalPrice.toFixed(2)}`)
    .moveDown();

  doc
    .fontSize(16)
    .text('Total', { underline: true })
    .moveDown(0.5);

  doc.fontSize(14).text(`Total Amount Due: €${booking.totalPrice.toFixed(2)}`);

  doc
    .moveDown(2)
    .fontSize(12)
    .text('Signature: ___________________________', { align: 'left' })
    .moveDown(1)
    .font('Helvetica-Oblique')
    .text('Proof of Stay - Thank you for choosing our villas!', { align: 'center' });

  doc.end();

  await new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });

  return filePath;
};

