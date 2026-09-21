-- ============================================================
--  Esquema do banco de dados (dialeto SQLite)
--  O back-end cria isso AUTOMATICAMENTE via EF Core na 1ª execução.
--  Este arquivo existe como referência e para uso manual, se quiser.
-- ============================================================

CREATE TABLE IF NOT EXISTS Workouts (
    Id        INTEGER PRIMARY KEY AUTOINCREMENT,
    Date      TEXT    NOT NULL UNIQUE,               -- data no formato ISO 'YYYY-MM-DD'
    Note      TEXT    NULL,
    CreatedAt TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Settings (
    Id          INTEGER PRIMARY KEY,
    WeeklyGoal  INTEGER NOT NULL DEFAULT 4,
    PeriodStart TEXT    NULL,                         -- 'YYYY-MM-DD'
    PeriodEnd   TEXT    NULL                          -- 'YYYY-MM-DD'
);

-- Configuração inicial (linha única)
INSERT OR IGNORE INTO Settings (Id, WeeklyGoal) VALUES (1, 4);


-- ============================================================
--  Versão equivalente para SQL Server (caso troque o provider)
-- ============================================================
-- CREATE TABLE Workouts (
--     Id        INT IDENTITY(1,1) PRIMARY KEY,
--     Date      DATE        NOT NULL UNIQUE,
--     Note      NVARCHAR(200) NULL,
--     CreatedAt DATETIME2   NOT NULL DEFAULT SYSUTCDATETIME()
-- );
-- CREATE TABLE Settings (
--     Id          INT PRIMARY KEY,
--     WeeklyGoal  INT  NOT NULL DEFAULT 4,
--     PeriodStart DATE NULL,
--     PeriodEnd   DATE NULL
-- );
-- INSERT INTO Settings (Id, WeeklyGoal) VALUES (1, 4);
