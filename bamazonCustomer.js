require("dotenv").config();

var inquirer = require('inquirer');
var mysql = require("mysql");


function createConnection() {
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "bootcamp",
        password: "bootcamp",
        database: "bamazon"
    });
    connection.connect(function (err) {
        if (err) throw err;
    });
    return connection;
}

function allQuery() {
    console.clear();
    console.log("All Products on BAmazon");
    console.log("");
    var connection = createConnection();
    connection.query('SELECT * FROM products',
        function (err, rows) {
            if (err) {
                console.log(err.message);
            }
            for (row in rows) {
                console.log(rows[row].product_id + " " + rows[row].product_name + " " + rows[row].price
                    + " " + rows[row].stock_quantity);
            }
            console.log("");
            // prompt();   //todo: put me back
        }
    );
    connection.end();
}

function purchaseItem(quantity, id, availableQty) {
    // console.clear();
    var stock_quantity = availableQty - parseInt(quantity);
    // console.log(availableQty);
    var connection = createConnection();
    connection.query('UPDATE products SET stock_quantity = ? where product_id = ?',
        [stock_quantity, id],
        function (err, rows) {
            if (err) {
                console.log(err.message);
            }
            allQuery();
        }
    );
    connection.end();
}

function checkQuantity(quantity, id) {
    console.log("check quantity against: "+quantity);

    var connection = createConnection();
    connection.query('SELECT stock_quantity FROM products where product_id = ?',
        // connection.query('SELECT * FROM products where product_id = ?',
        [id],
        function (err, rows) {
            if (err) {
                console.log(err.message);
            }
            console.log(rows);
            // return rows.stock_quantity;
            if(parseInt(rows[0].stock_quantity) >= parseInt(quantity)) {
                console.log("availale");
                purchaseItem(quantity, id, rows[0].stock_quantity);
            } else {
                console.log("low quantity");
                allQuery();
            }
        }
    );
    connection.end();
}

function prompt() {
    inquirer.prompt([
        {
            name: "id",
            message: "What item would you like to purchase? ",
        },
        {
            name: "quantity",
            message: "How many would you like? "
        }
    ]).then(function (answers) {
        console.log(answers);
        checkQuantity(parseInt(answers.quantity), parseInt(answers.id));
        // purchaseItem(answers.quantity, answers.id);
    });
}

function displayItemms() {
    allQuery();
}

function testCase() {
}
displayItemms();
