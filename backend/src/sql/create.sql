-- User 테이블
CREATE TABLE `User` (
    `ID` VARCHAR(36) NOT NULL, -- device ID
    `coupleID` VARCHAR(36) UNIQUE, -- 연인의 device ID
    `name` VARCHAR(20),
    PRIMARY KEY (`ID`),
    FOREIGN KEY (`coupleID`) REFERENCES `User` (`ID`) ON DELETE CASCADE
);

-- Question 테이블 100개의 감정 질문 저장
CREATE TABLE `Question` (
    `questionID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `questionText` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`questionID`)
);

-- QuestionAnswer 테이블
CREATE TABLE `QnA` (
    `qnaID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `questionID` BINARY(16) NOT NULL,
    `answerText` VARCHAR(255) NULL,
    PRIMARY KEY (`qnaID`),
    FOREIGN KEY (`questionID`) REFERENCES `Question` (`questionID`) ON DELETE CASCADE
);

-- Emotion 테이블
CREATE TABLE `Emotion` (
    `emotionID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `ID` VARCHAR(36) NOT NULL,
    `qnaID` BINARY(16) NOT NULL,
    `qnaID2` BINARY(16) NOT NULL,
    `qnaID3` BINARY(16) NOT NULL,
    `color` VARCHAR(10) NOT NULL, -- HEX 색상 (#FFFFFF)
    `date` DATE NOT NULL DEFAULT (CURDATE()), -- 날짜만 저장, 기본값은 오늘 날짜
    PRIMARY KEY (`emotionID`),
    FOREIGN KEY (`ID`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`qnaID`) REFERENCES `QnA` (`qnaID`) ON DELETE CASCADE,
    FOREIGN KEY (`qnaID2`) REFERENCES `QnA` (`qnaID`) ON DELETE CASCADE,
    FOREIGN KEY (`qnaID3`) REFERENCES `QnA` (`qnaID`) ON DELETE CASCADE
);

-- Artwork 테이블
CREATE TABLE `Artwork` (
    `artworkID` BINARY(16) NOT NULL, -- Optimized UUID storage
    `ID` VARCHAR(36) NOT NULL,
    `ID2` VARCHAR(36) NOT NULL,
    `emotionID` BINARY(16) NOT NULL,
    `emotionID2` BINARY(16) NOT NULL,
    `artworkPath` VARCHAR(255) NOT NULL, -- 서버에 이미지 저장 후 DB에 경로 저장
    `date` DATE NOT NULL DEFAULT (CURDATE()), -- 날짜만 저장, 기본값은 오늘 날짜
    PRIMARY KEY (`artworkID`),
    FOREIGN KEY (`ID`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`ID2`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`emotionID`) REFERENCES `Emotion` (`emotionID`) ON DELETE CASCADE,
    FOREIGN KEY (`emotionID2`) REFERENCES `Emotion` (`emotionID`) ON DELETE CASCADE
);