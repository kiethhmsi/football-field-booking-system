-- Run this once before testing Gmail notifications from booking contact email.
ALTER TABLE bookings
ADD COLUMN contact_email VARCHAR(255) NULL
AFTER team_name;
