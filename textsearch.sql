ALTER TABLE "Book"
ADD COLUMN document tsvector;
update "Book"
set document = to_tsvector(title || ' ' || author || ' ' || publisher || '' || notes);

ALTER TABLE "Book"
ADD COLUMN document_with_idx tsvector;
update "Book"
set document_with_idx = to_tsvector(title || ' ' || coalesce(author, '') || ' ' || coalesce(publisher, '') || '' || coalesce(notes, ''));
CREATE INDEX document_idx
ON "Book"
USING GIN(document_with_idx);

ALTER TABLE "Book"
  ADD COLUMN document_with_weights tsvector;
update "Book"
set document_with_weights = setweight(to_tsvector(title), 'A') ||
  setweight(to_tsvector(coalesce(author, '')), 'B') ||
  setweight(to_tsvector(coalesce(publisher, '')), 'C') ||
  setweight(to_tsvector(coalesce(notes, '')), 'D');
CREATE INDEX document_weights_idx
  ON "Book"
  USING GIN (document_with_weights);

CREATE FUNCTION book_tsvector_trigger() RETURNS trigger AS $$
begin
  new.document :=
  setweight(to_tsvector('english', coalesce(new.title, '')), 'A')
  || setweight(to_tsvector('english', coalesce(new.author, '')), 'B')
  || setweight(to_tsvector('english', coalesce(new.publisher, '')), 'C')
  || setweight(to_tsvector('english', coalesce(new.notes, '')), 'D');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON "Book" FOR EACH ROW EXECUTE PROCEDURE book_tsvector_trigger();
