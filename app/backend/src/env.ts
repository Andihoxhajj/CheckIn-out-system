const defaults: Record<string, string> = {
  DATABASE_URL: 'file:../database/app.db',
  INVOICE_OUTPUT_DIR: '../invoices',
  PORT: '3001',
};

Object.entries(defaults).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});

export {};

