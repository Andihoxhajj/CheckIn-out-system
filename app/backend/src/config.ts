import path from 'path';

const env = process.env;

export const config = {
  port: Number(env.PORT) || 3001,
  invoiceDir: path.resolve(
    process.cwd(),
    env.INVOICE_OUTPUT_DIR ?? '../invoices',
  ),
};

