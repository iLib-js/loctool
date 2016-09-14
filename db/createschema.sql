USE translations;

CREATE TABLE Resources (
    id               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reskey           VARCHAR(100) NOT NULL,
    text             TEXT NOT NULL,
    locale           VARCHAR(15),
    path             VARCHAR(512),
    project          VARCHAR(64),
    context          VARCHAR(20),
    autoId           BOOLEAN,
    resType          INT,
    ordinal          INT,
    class            VARCHAR(10),
    state            INT
);



