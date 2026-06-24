ALTER TABLE "criminals"
ADD CONSTRAINT "criminals_nid_check"
CHECK (
  "identification_no" ~ '^(\d{10}|\d{13}|\d{17})$'
);