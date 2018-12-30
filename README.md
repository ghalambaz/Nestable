# Nestable
Drag &amp; drop Hierarchical List With Database

With Help of [**SQL Antipattern Book**](https://www.amazon.com/SQL-Antipatterns-Programming-Pragmatic-Programmers/dp/1934356557) And Based On [**Nestable Jquery Plugin**](https://github.com/dbushell/Nestable) 

> it's a bit old but database is well designed and fast .

### Maybe you need a table like this but code will create it if not exist
```sql
CREATE TABLE tb_ag_nestable (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name char(100) NOT NULL,
  lable varchar(255) NOT NULL,
  parent int(10) unsigned NOT NULL,
  status enum('active','deactivate','deleted') NOT NULL DEFAULT 'active',
  priority int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY index_unique_name (name),
  KEY index_parent_priority (parent,priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```
