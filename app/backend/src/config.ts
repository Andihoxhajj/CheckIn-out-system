import path from 'path';
import fs from 'fs';

const env = process.env;

// Resolve invoice directory relative to app/backend structure
// Try multiple possible locations
const getInvoiceDir = () => {
  if (env.INVOICE_OUTPUT_DIR) {
    return path.resolve(env.INVOICE_OUTPUT_DIR);
  }

  // Try relative to process.cwd() (works in dev and when run from project root)
  const cwd = process.cwd();
  const possiblePaths = [
    path.resolve(cwd, 'app/invoices'),
    path.resolve(cwd, 'invoices'),
    path.resolve(__dirname, '../../invoices'),
    path.resolve(__dirname, '../invoices'),
  ];

  // Use first path that exists, or create the first one
  for (const dir of possiblePaths) {
    try {
      if (fs.existsSync(path.dirname(dir))) {
        return dir;
      }
    } catch {
      // Continue to next path
    }
  }

  // Default to app/invoices relative to cwd
  return path.resolve(cwd, 'app/invoices');
};

export const config = {
  port: Number(env.PORT) || 3001,
  invoiceDir: getInvoiceDir(),
};

