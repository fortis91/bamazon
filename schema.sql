DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products (
  product_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(5,2) NOT NULL,
  stock_quantity INT NOT NULL,

  PRIMARY KEY (product_id)
);
GRANT ALL ON bamazon.* TO 'bootcamp'@'localhost';

INSERT INTO products
  (product_name, department_name, price, stock_quantity)
    VALUES('NoteBook', 'Electronics', 499.99, 10);
INSERT INTO products
  (product_name, department_name, price, stock_quantity)
    VALUES('Desktop Computer', 'Electronics', 699.99, 10);
INSERT INTO products
  (product_name, department_name, price, stock_quantity)    
    VALUES('BAmazon Book', 'Books', 9.99, 10);  