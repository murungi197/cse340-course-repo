ALTER TABLE public.organization
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS contact_email VARCHAR(254),
    ADD COLUMN IF NOT EXISTS logo_filename VARCHAR(255);

UPDATE public.organization
SET description = ''
WHERE description IS NULL;

UPDATE public.organization
SET logo_filename = 'placeholder-logo.png'
WHERE logo_filename IS NULL;

ALTER TABLE public.organization
    ALTER COLUMN description SET DEFAULT '',
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN logo_filename SET DEFAULT 'placeholder-logo.png',
    ALTER COLUMN logo_filename SET NOT NULL;