-- To run any migration / setup database, run the following
-- line with appropriate values
-- $ psql -U username -d myDataBase -af schema.sql

CREATE TABLE IF NOT EXISTS "public"."Book" (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  isbn VARCHAR(20),
  publisher VARCHAR(255),
  "publishedAt" INTEGER,
  "count" INTEGER DEFAULT 1,
  "stock" INTEGER DEFAULT 1,
  comment VARCHAR(500),
  "image" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."Category" (
  id SERIAL PRIMARY KEY NOT NULL,
  "name" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."_BookToCategory" (
  "A" integer NOT NULL REFERENCES "Book"(id),
  "B" integer NOT NULL REFERENCES "Category"(id)
);
CREATE UNIQUE INDEX "_BookToCategory_AB_unique" ON "_BookToCategory"("A" int4_ops,"B" int4_ops);
CREATE INDEX "_BookToCategory_B_index" ON "_BookToCategory"("B" int4_ops);
