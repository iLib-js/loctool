USE translations;

CREATE TABLE Resources (
    id               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reskey           VARCHAR(100) NOT NULL,
    source           TEXT,
    locale           VARCHAR(15),
    path             VARCHAR(512),
    project          VARCHAR(64),
    context          VARCHAR(20),
    autoId           BOOLEAN,
    resType          INT,
    state            INT,
    primary key (id)
);

ALTER TABLE Resources ADD CONSTRAINT uc_Resources UNIQUE (project, resKey, context, sourceLocale);

CREATE TABLE Translations (
    id               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sourceId         INT NOT NULL,
    text             TEXT,
    ordinal          INT,
    class            VARCHAR(10),
    locale           VARCHAR(15),
    state            INT,
    primary key (id)
);

ALTER TABLE Translations ADD FOREIGN KEY (sourceId) REFERENCES Resources(id);

