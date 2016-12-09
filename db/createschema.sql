USE translations;

CREATE TABLE Resources (
    id               INT NOT NULL AUTO_INCREMENT UNIQUE KEY,
    project          VARCHAR(64),
    context          VARCHAR(20),                 -- for Android resources
    locale           VARCHAR(15),
    reskey           VARCHAR(100) NOT NULL,
    text             TEXT NOT NULL,
    pathName         VARCHAR(512),                
    autoKey          BOOLEAN,                     -- true = the key was auto-generated, false = explicit key
    resType          VARCHAR(10),                 -- string, array, or plural
    ordinal          INT,                         -- for array resources
    pluralClass      VARCHAR(10),                 -- for plural resources
    state            INT,
    comment          VARCHAR(256),
    formatted        BOOLEAN,                     -- for android resources
    source           BOOLEAN,                     -- true = source string, false = target
    dnt              BOOLEAN,                     -- do not translate
    datatype         VARCHAR(30)                  -- data type of this resource
);

CREATE UNIQUE INDEX res ON Resources (`project`, `context`, `reskey`, `locale`, `ordinal`, `pluralClass`);
