-- To run any migration / setup database, run the following
-- line with appropriate values
-- $ psql -U username -d myDataBase -af schema.sql

CREATE TYPE "userrole" AS ENUM (
  'BASIC',
  'ADMIN',
  'EDITOR'
);

CREATE TYPE "orderstatus" AS ENUM (
  'PENDING',
  'RENTED',
  'RETURNED',
  'LATE'
);

CREATE TABLE IF NOT EXISTS "public"."User" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar UNIQUE,
  "password" varchar,
  "name" varchar,
  "createdAt" timestamp DEFAULT (now()),
  "role" userrole DEFAULT ('BASIC')
);

CREATE TABLE IF NOT EXISTS "public"."Book" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar,
  "author" varchar,
  "isbn" varchar UNIQUE,
  "publisher" varchar,
  "publishedAt" int,
  "stockCount" int DEFAULT (1),
  "count" int DEFAULT (1),
  "notes" varchar,
  "image" varchar,
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS "public"."Order" (
  "id" SERIAL PRIMARY KEY,
  "userId" int NOT NULL,
  "returnDate" timestamp,
  "status" orderstatus DEFAULT ('PENDING'),
  "createdAt" timestamp DEFAULT (now()),
  "updatedAt" timestamp DEFAULT (now()),

  FOREIGN KEY ("userId") REFERENCES "User"(id)
);

CREATE TABLE IF NOT EXISTS "public"."BookToOrder" (
  "id" SERIAL PRIMARY KEY,
  "orderId" int NOT NULL,
  "bookId" int NOT NULL,
  "quantity" int DEFAULT 1,
  FOREIGN KEY ("bookId")  REFERENCES "Book"(id),
  FOREIGN KEY ("orderId") REFERENCES "Order"(id)
);

CREATE UNIQUE INDEX "BookToOrder_book_order_unique" ON "BookToOrder"("bookId" int4_ops,"orderId" int4_ops);

-- CREATE TABLE IF NOT EXISTS "public"."Cart" (
--   "id" int PRIMARY KEY,
--   "userId" int REFERENCES "User"(id)
--   FOREIGN KEY ("userId") REFERENCES "User"(id)
-- );

-- CREATE TABLE IF NOT EXISTS "public"."BookToCart" (
--   "id" SERIAL PRIMARY KEY,
--   "cartId" int NOT NULL,
--   "bookId" int NOT NULL,
--   "quantity" int DEFAULT 1,
--   FOREIGN KEY ("bookId")  REFERENCES "Book"(id),
--   FOREIGN KEY ("cartId") REFERENCES "Cart"(id)
-- );

-- CREATE UNIQUE INDEX "BookToCart_book_cart_unique" ON "BookToCart"("bookId" int4_ops,"cartId" int4_ops);

-- CREATE TABLE IF NOT EXISTS "public"."Comment" (
--   "id" SERIAL PRIMARY KEY,
--   "text" varchar,
--   "userId" int,
--   "orderId" int,
--   "createdAt" timestamp DEFAULT (now())
-- );

CREATE TABLE IF NOT EXISTS "public"."Category" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar
);

CREATE TABLE IF NOT EXISTS "public"."_BookToCategory" (
  "A" integer NOT NULL REFERENCES "Book"(id),
  "B" integer NOT NULL REFERENCES "Category"(id)
);

CREATE UNIQUE INDEX "_BookToCategory_AB_unique" ON "_BookToCategory"("A" int4_ops,"B" int4_ops);
CREATE INDEX "_BookToCategory_B_index" ON "_BookToCategory"("B" int4_ops);

CREATE UNIQUE INDEX ON "User" ("id");

CREATE UNIQUE INDEX ON "Order" ("id");

CREATE UNIQUE INDEX ON "Book" ("id");

CREATE UNIQUE INDEX ON "Comment" ("id");
