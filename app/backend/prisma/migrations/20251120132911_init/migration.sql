-- CreateTable
CREATE TABLE "Villa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "pricePerNight" INTEGER NOT NULL DEFAULT 100
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "villaId" INTEGER NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "guestID" TEXT NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "pdfPath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_villaId_fkey" FOREIGN KEY ("villaId") REFERENCES "Villa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
