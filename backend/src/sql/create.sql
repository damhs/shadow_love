-- User 테이블
CREATE TABLE `User` (
    `userID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `name` VARCHAR(20) NOT NULL,
    `id` VARCHAR(20) UNIQUE, -- 유일한 ID
    'email' VARCHAR(50) NOT NULL UNIQUE, -- 유일한 이메일
    `password` VARCHAR(255), -- 암호화된 비밀번호 저장
    PRIMARY KEY (`userID`)
);

-- Question 테이블
CREATE TABLE `Question` (
    `questionID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `questionText` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`questionID`)
);

-- Answer 테이블
CREATE TABLE `Answer` (
    `answerID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `answerText` VARCHAR(255) NULL,
    PRIMARY KEY (`answerID`)
);

-- Couple 테이블
CREATE TABLE `Couple` (
    `coupleID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `userID` BINARY(16) NOT NULL,
    `userID2` BINARY(16) NOT NULL,
    PRIMARY KEY (`coupleID`),
    FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
    FOREIGN KEY (`userID2`) REFERENCES `User` (`userID`) ON DELETE CASCADE
);

-- Emotion 테이블
CREATE TABLE `Emotion` (
    `emotionID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `userID` BINARY(16) NOT NULL,
    `questionID` BINARY(16) NOT NULL,
    `answerID` BINARY(16) NOT NULL,
    `questionID2` BINARY(16) NOT NULL,
    `answerID2` BINARY(16) NOT NULL,
    `questionID3` BINARY(16) NOT NULL,
    `answerID3` BINARY(16) NOT NULL,
    `color` VARCHAR(10) NOT NULL, -- HEX 색상 (#FFFFFF)
    `date` DATE NOT NULL DEFAULT (CURDATE()), -- 날짜만 저장, 기본값은 오늘 날짜
    PRIMARY KEY (`emotionID`),
    INDEX `idx_userID` (`userID`),
    FOREIGN KEY (`userID`) REFERENCES `User` (`userID`) ON DELETE CASCADE,
    FOREIGN KEY (`questionID`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE,
    FOREIGN KEY (`questionID2`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE,
    FOREIGN KEY (`questionID3`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE
);

-- Artwork 테이블
CREATE TABLE `Artwork` (
    `artworkID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `coupleID` BINARY(16) NOT NULL,
    `emotionID` BINARY(16) NOT NULL,
    `emotionID2` BINARY(16) NOT NULL,
    `artworkPath` VARCHAR(255) NOT NULL, -- 서버 경로 저장
    PRIMARY KEY (`artworkID`),
    FOREIGN KEY (`coupleID`) REFERENCES `Couple` (`coupleID`) ON DELETE CASCADE,
    FOREIGN KEY (`emotionID`) REFERENCES `Emotion` (`emotionID`) ON DELETE CASCADE,
    FOREIGN KEY (`emotionID2`) REFERENCES `Emotion` (`emotionID`) ON DELETE CASCADE
);