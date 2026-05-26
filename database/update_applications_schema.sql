-- Update match_applications table to support manual team name and skill level
ALTER TABLE match_applications 
ADD COLUMN applicant_team_name VARCHAR(255) AFTER applicant_team_id,
ADD COLUMN applicant_skill_level VARCHAR(100) AFTER applicant_team_name;
