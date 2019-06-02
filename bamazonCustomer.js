require("dotenv").config();

var inquirer = require('inquirer');
var mysql = require("mysql");
var columnify = require('columnify')


function createConnection() {
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "bootcamp",
        password: "bootcamp",
        database: "bamazon"
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// function allQuery() {
//     console.clear();
//     console.log("Products on BAmazon");
//     console.log("");
//     var connection = createConnection();
//     connection.query('SELECT * FROM products',
//         function(err, rows) {
//             if (err) {
//                 console.log(err.message);
//             }
//             console.log("ID" + "\tProduct" + "\t\tQty");
//             for (row in rows) {
//                 console.log(rows[row].product_id + "\t" + rows[row].product_name + "\t" + rows[row].price +
//                     " " + rows[row].stock_quantity);
//             }
//             console.log("");
//             // prompt();   //todo: put me back
//         }
//     );
//     connection.end();
// }

function allQuery(message) {
    console.clear();
    console.log("Products on BAmazon");
    console.log("");
    var connection = createConnection();
    connection.query(`SELECT product_id as "ID", product_name as "Item", 
                        price as "Price", stock_quantity as "Qty" FROM products WHERE stock_quantity > 0`,
        function(err, rows) {
            if (err) {
                console.log(err.message);
            }
            console.log(columnify(rows));
            if (message) {
                console.log(message);
            } else {
                console.log("");
            }
            prompt();
        }
    );
    connection.end();
}

function purchaseItem(quantity, id, availableQty) {
    var stock_quantity = availableQty - parseInt(quantity);
    var connection = createConnection();
    connection.query('UPDATE products SET stock_quantity = ? where product_id = ?', [stock_quantity, id],
        function(err, rows) {
            if (err) {
                console.log(err.message);
            }
            allQuery();
        }
    );
    connection.end();
}

function checkQuantity(quantity, id) {
    var connection = createConnection();
    connection.query('SELECT stock_quantity FROM products where product_id = ?', [id],
        function(err, rows) {
            if (err) {
                console.log(err.message);
            }
            console.log(rows);
            if (parseInt(rows[0].stock_quantity) >= parseInt(quantity)) {
                purchaseItem(quantity, id, rows[0].stock_quantity);
            } else {
                allQuery("requested quantity not available");
            }
        }
    );
    connection.end();
}

function prompt() {
    inquirer.prompt([{
            name: "id",
            message: "What item would you like to purchase? ",
        },
        {
            name: "quantity",
            message: "How many would you like? "
        }
    ]).then(function(answers) {
        console.log(answers);
        checkQuantity(parseInt(answers.quantity), parseInt(answers.id));
    });
}

function displayItemms() {
    allQuery();
}

function testCase() {}
displayItemms();