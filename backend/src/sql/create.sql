-- User 테이블
CREATE TABLE
  `User` (
    `ID` VARCHAR(36) NOT NULL, -- device ID
    `coupleID` VARCHAR(36) UNIQUE, -- 연인의 device ID
    `name` VARCHAR(20),
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`coupleID`) REFERENCES `User` (`ID`) ON DELETE CASCADE
  );

-- Question 테이블 100개의 감정 질문 저장
CREATE TABLE
  `Question` (
    `questionID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `questionText` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`questionID`)
  );

-- Diary 테이블
CREATE TABLE
  `Diary` (
    `diaryID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `ID` VARCHAR(36) NOT NULL,
    `questionID1` BINARY(16) NOT NULL,
    `answerText1` VARCHAR(255) NOT NULL,
    `questionID2` BINARY(16) NOT NULL,
    `answerText2` VARCHAR(255) NOT NULL,
    `questionID3` BINARY(16) NOT NULL,
    `answerText3` VARCHAR(255) NOT NULL,
    `date` DATE, -- 날짜만 저장, 기본값은 오늘 날짜
    PRIMARY KEY (`diaryID`),
    FOREIGN KEY (`ID`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`questionID1`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE,
    FOREIGN KEY (`questionID2`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE,
    FOREIGN KEY (`questionID3`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE
  );

-- Emotion 테이블
CREATE TABLE
  `Emotion` (
    `emotionID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `ID` VARCHAR(36) NOT NULL,
    `diaryID` BINARY(16) NOT NULL,
    `color` VARCHAR(10) NOT NULL, -- HEX 색상 (#FFFFFF)
    `date` DATE, -- 날짜만 저장, 기본값은 오늘 날짜
    PRIMARY KEY (`emotionID`),
    FOREIGN KEY (`ID`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`diaryID`) REFERENCES `Diary` (`diaryID`) ON DELETE CASCADE
  );

-- Artwork 테이블
CREATE TABLE
  `Artwork` (
    `artworkID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `ID1` VARCHAR(36) NOT NULL,
    `ID2` VARCHAR(36) NOT NULL,
    `emotionID1` BINARY(16) NOT NULL,
    `emotionID2` BINARY(16) NOT NULL,
    `artworkPath` VARCHAR(255) NOT NULL, -- 서버에 이미지 저장 후 DB에 경로 저장
    `date` DATE, -- 날짜만 저장, 기본값은 오늘 날짜
    `title` VARCHAR(20);
    `description` VARCHAR(255); -- 작품 설명
    PRIMARY KEY (`artworkID`),
    FOREIGN KEY (`ID1`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`ID2`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`emotionID1`) REFERENCES `Emotion` (`emotionID`) ON DELETE CASCADE,
    FOREIGN KEY (`emotionID2`) REFERENCES `Emotion` (`emotionID`) ON DELETE CASCADE
  );

-- Trigger
DELIMITER //
CREATE TRIGGER before_insert_diary
BEFORE INSERT ON `Diary`
FOR EACH ROW
BEGIN
    IF NEW.date IS NULL THEN
        SET NEW.date = CURRENT_DATE; -- 괄호 제거
    END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER before_insert_emotion
BEFORE INSERT ON `Emotion`
FOR EACH ROW
BEGIN
    IF NEW.date IS NULL THEN
        SET NEW.date = CURRENT_DATE; -- 괄호 제거
    END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER before_insert_artwork
BEFORE INSERT ON `Artwork`
FOR EACH ROW
BEGIN
    IF NEW.date IS NULL THEN
        SET NEW.date = CURRENT_DATE; -- 괄호 제거
    END IF;
END;
//
DELIMITER ;