ALTER TABLE contact_messages
    ADD COLUMN IF NOT EXISTS read BOOLEAN NOT NULL DEFAULT FALSE;

-- Preserve the reliable read state already represented by legacy READ statuses.
UPDATE contact_messages
SET read = TRUE
WHERE status = 'READ';
