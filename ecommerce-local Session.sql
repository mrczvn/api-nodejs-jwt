select
  *
from usuarios;
alter table usuarios
ADD
  UNIQUE (email);
describe usuarios;
ALTER TABLE usuarios
MODIFY
  COLUMN senha VARCHAR(100) NOT NULL;