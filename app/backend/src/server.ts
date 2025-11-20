import express from 'express';
import cors from 'cors';
import './env';
import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import dayjs from 'dayjs';
import { config } from './config';
import { calculateNights } from './utils/date';
import { generateInvoice } from './services/pdfService';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const bookingSchema = z.object({
  guestName: z.string().min(2),
  guestPhone: z.string().min(6),
  guestID: z.string().min(4),
  villaId: z.number().int().positive(),
  checkIn: z.string(),
  checkOut: z.string(),
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/villas/list', async (_req, res) => {
  const villas = await prisma.villa.findMany({
    orderBy: { id: 'asc' },
    include: {
      bookings: {
        where: { status: 'Active' },
        orderBy: { checkIn: 'desc' },
        take: 1,
      },
    },
  });
  res.json(villas);
});

app.patch(
  '/villas/update',
  async (req, res): Promise<void> => {
    const bodySchema = z.object({
      id: z.number().int().positive(),
      name: z.string().optional(),
      pricePerNight: z.number().int().positive().optional(),
      status: z.enum(['Available', 'Occupied', 'Cleaning', 'Reserved']).optional(),
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error.flatten());
      return;
    }
    const { id, ...data } = parsed.data;
    try {
      const updated = await prisma.villa.update({ where: { id }, data });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update villa', error });
    }
  },
);

app.post('/bookings/create', async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }
  const payload = parsed.data;
  const checkIn = dayjs(payload.checkIn).toDate();
  const checkOut = dayjs(payload.checkOut).toDate();

  if (!dayjs(checkOut).isAfter(checkIn)) {
    res.status(400).json({ message: 'Check-out must be after check-in' });
    return;
  }

  const overlap = await prisma.booking.findFirst({
    where: {
      villaId: payload.villaId,
      status: 'Active',
      NOT: [
        {
          checkOut: { lte: checkIn },
        },
        {
          checkIn: { gte: checkOut },
        },
      ],
    },
  });

  if (overlap) {
    res.status(409).json({ message: 'Villa already booked for selected dates' });
    return;
  }

  const villa = await prisma.villa.findUnique({ where: { id: payload.villaId } });
  if (!villa) {
    res.status(404).json({ message: 'Villa not found' });
    return;
  }

  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = nights * villa.pricePerNight;

  const booking = await prisma.booking.create({
    data: {
      guestName: payload.guestName,
      guestPhone: payload.guestPhone,
      guestID: payload.guestID,
      villaId: villa.id,
      checkIn,
      checkOut,
      totalPrice,
    },
  });

  await prisma.villa.update({
    where: { id: villa.id },
    data: { status: 'Occupied' },
  });

  res.status(201).json(booking);
});

app.post('/bookings/checkout', async (req, res) => {
  const schema = z.object({
    bookingId: z.number().int().positive(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    include: { villa: true },
  });

  if (!booking) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  if (booking.status !== 'Active') {
    res.status(400).json({ message: 'Booking already checked out' });
    return;
  }

  const pdfPath = await generateInvoice({
    booking,
    villa: booking.villa,
  });

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'Completed', pdfPath },
  });

  await prisma.villa.update({
    where: { id: booking.villaId },
    data: { status: 'Cleaning' },
  });

  res.json(updatedBooking);
});

app.get('/bookings/history', async (req, res) => {
  const schema = z.object({
    villaId: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    from: z.string().optional(),
    to: z.string().optional(),
  });
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json(parsed.error.flatten());
    return;
  }

  const { villaId, from, to } = parsed.data;
  const filters: Prisma.BookingWhereInput = {
    status: 'Completed',
  };

  if (villaId) filters.villaId = villaId;

  if (from || to) {
    filters.AND = [
      {
        checkIn: from ? { gte: dayjs(from).toDate() } : undefined,
      },
      {
        checkOut: to ? { lte: dayjs(to).toDate() } : undefined,
      },
    ].filter((condition) => condition.checkIn || condition.checkOut);
  }

  const history = await prisma.booking.findMany({
    where: filters,
    orderBy: { checkIn: 'desc' },
    include: { villa: true },
  });

  res.json(history);
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${config.port}`);
});

