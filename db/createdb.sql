CREATE DATABASE IF NOT EXISTS translations CHARACTER SET = 'utf8';

DROP USER 'ht'@'localhost', 'ht'@'%';

CREATE USER 'ht'@'localhost' IDENTIFIED BY 'dYw@j45XKk#$';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER,INDEX
    ON translations.*
    TO 'ht'@'localhost';

CREATE USER 'ht'@'%' IDENTIFIED BY 'dYw@j45XKk#$';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER,INDEX
    ON translations.*
    TO 'ht'@'%';
