
-- Script to generate standard 1.5h slots for KaSport Premium (field_id = 1)
-- weekday and weekend

USE sanbong;

-- Clear old price-rule style slots for field 1
DELETE FROM time_slots WHERE field_id = 1;

-- Function-like logic using a procedure to insert slots
DELIMITER //

CREATE PROCEDURE InsertStandardSlots(IN fId INT, IN pType VARCHAR(50))
BEGIN
    DECLARE startTime TIME DEFAULT '05:00:00';
    DECLARE endTime TIME DEFAULT '06:30:00';
    DECLARE price INT DEFAULT 200000;
    DECLARE cat VARCHAR(20) DEFAULT 'off_peak';

    WHILE startTime < '23:00:00' DO
        -- Set price based on time
        IF startTime >= '17:00:00' AND startTime < '22:00:00' THEN
            SET price = CASE WHEN pType = '5_nguoi' THEN 350000 WHEN pType = '7_nguoi' THEN 600000 ELSE 1000000 END;
            SET cat = 'peak';
        ELSE
            SET price = CASE WHEN pType = '5_nguoi' THEN 200000 WHEN pType = '7_nguoi' THEN 400000 ELSE 800000 END;
            SET cat = 'off_peak';
        END IF;

        -- Weekday
        INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price, is_active)
        VALUES (fId, pType, 'weekday', startTime, endTime, cat, price, 1);

        -- Weekend (Price + 50k)
        INSERT INTO time_slots (field_id, pitch_type, day_type, start_time, end_time, category, price, is_active)
        VALUES (fId, pType, 'weekend', startTime, endTime, cat, price + 50000, 1);

        SET startTime = endTime;
        SET endTime = ADDTIME(startTime, '01:30:00');
    END WHILE;
END //

DELIMITER ;

CALL InsertStandardSlots(1, '5_nguoi');
CALL InsertStandardSlots(1, '7_nguoi');
CALL InsertStandardSlots(1, '11_nguoi');

DROP PROCEDURE InsertStandardSlots;
