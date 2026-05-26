-- Update open_matches table to support manual host team name
ALTER TABLE open_matches 
ADD COLUMN host_team_name VARCHAR(255) AFTER team_id;
