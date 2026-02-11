-- Update Contact Settings
UPDATE contact_settings
SET 
    address = 'P.O.BOX 923, MBALE (U)',
    phone_main = '0781425483',
    phone_admissions = '0701814161',
    email_general = 'bugisuhighschool@gmail.com',
    email_admissions = 'bugisuhighschool@gmail.com',
    office_hours = 'Mon - Fri: 8:00 AM - 6:00 PM'
WHERE id = (SELECT id FROM contact_settings LIMIT 1);

-- Update Admissions Settings
UPDATE admissions_settings
SET 
    status = 'OPEN',
    academic_year = '2026'
WHERE id = (SELECT id FROM admissions_settings LIMIT 1);
