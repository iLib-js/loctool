USE translations;

CREATE TABLE Resources (
    id               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    project          VARCHAR(64),
    context          VARCHAR(20),
    locale           VARCHAR(15),
    reskey           VARCHAR(100) NOT NULL,
    text             TEXT NOT NULL,
    pathName         VARCHAR(512),
    autoKey          BOOLEAN,
    resType          VARCHAR(10),
    ordinal          INT,
    pluralClass      VARCHAR(10),
    state            INT
);

CREATE UNIQUE INDEX res ON Resources (`project`, `context`, `reskey`, `locale`);
