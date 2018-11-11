DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL,
PRIMARY KEY (item_id)
) 

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ('rice','food',30.99,10), 
('bread','food',6.99,10),
('candy','food',3.99,10),
('tv','electronic',1599.99,10),
('camera','electronic',200.99,10),
('cellphone','electronic',600.99,10),
('diaper','baby',20.99,10),
('stroller','baby',300.99,10),
('formula','baby',35.99,10),
('toy','baby',9.99,10)