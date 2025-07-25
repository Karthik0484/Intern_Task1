-- Update incidents with proper thumbnail URLs pointing to public/images folder
-- Clear existing data and insert new sample incidents with local image paths

DELETE FROM incidents;

-- Insert sample incidents with proper thumbnail URLs
INSERT INTO incidents (id, camera_id, type, location, status, thumbnail_url, ts_start, ts_end, resolved, created_at) VALUES
-- Suspicious Activity incidents
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Vault' LIMIT 1), 'Suspicious Activity', 'Backroom', 'unresolved', '/images/suspicious-activity.jpg', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours' + INTERVAL '2 minutes', false, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Shop Floor A' LIMIT 1), 'Suspicious Activity', 'Ground Floor', 'unresolved', '/images/incident1.jpg', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '3 minutes', false, NOW() - INTERVAL '1 day'),

-- Unauthorized Access incidents  
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Main Entrance' LIMIT 1), 'Unauthorised Access', 'Front Gate', 'unresolved', '/images/unauthorized-access.jpg', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '1 minute', false, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Shop Floor A' LIMIT 1), 'Unauthorised Access', 'Ground Floor', 'unresolved', '/images/unauthorized-access.jpg', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours' + INTERVAL '2 minutes', false, NOW() - INTERVAL '5 hours'),

-- Gun Threat incidents
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Vault' LIMIT 1), 'Gun Threat', 'Backroom', 'resolved', '/images/gun-threat.jpg', NOW() - INTERVAL '1 day 2 hours', NOW() - INTERVAL '1 day 2 hours' + INTERVAL '5 minutes', true, NOW() - INTERVAL '1 day 2 hours'),

-- Additional incidents for testing
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Main Entrance' LIMIT 1), 'Suspicious Activity', 'Front Gate', 'unresolved', '/images/suspicious-activity.jpg', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes' + INTERVAL '1 minute', false, NOW() - INTERVAL '30 minutes'),
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Vault' LIMIT 1), 'Unauthorised Access', 'Backroom', 'resolved', '/images/unauthorized-access.jpg', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours' + INTERVAL '3 minutes', true, NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), (SELECT id FROM cameras WHERE name = 'Shop Floor A' LIMIT 1), 'Gun Threat', 'Ground Floor', 'resolved', '/images/gun-threat.jpg', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '4 minutes', true, NOW() - INTERVAL '2 days');