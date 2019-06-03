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

// function displayItems() {
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

function displayItems(message) {
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

function purchaseItem(quantity, id, availableQty, price) {
    var stock_quantity = availableQty - parseInt(quantity);
    var connection = createConnection();
    connection.query('UPDATE products SET stock_quantity = ? where product_id = ?', [stock_quantity, id],
        function(err, rows) {
            if (err) {
                console.log(err.message);
            }
            displayTotal(quantity, price);
            // displayItems();
        }
    );
    connection.end();
}

function checkQuantity(quantity, id) {
    var connection = createConnection();
    connection.query('SELECT stock_quantity, price, product_name FROM products where product_id = ?', [id],
        function(err, rows) {
            if (err) {
                console.log(err.message);
            }
            console.log(rows);
            if (parseInt(rows[0].stock_quantity) >= parseInt(quantity)) {
                purchaseItem(quantity, id, rows[0].stock_quantity, rows[0].price);
            } else {
                displayItems("requested quantity not available");
                // displayTotal();
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
        checkQuantity(parseInt(answers.quantity), parseInt(answers.id));
    });
}

// function buyAgain() {
//     inquirer.prompt([{
//         name: "answer",
//         message: "What item would you like to purchase? ",
//     }, ]).then(function(answers) {
//         console.log(answers);
//         checkQuantity(parseInt(answers.quantity), parseInt(answers.id));
//     });
// }

function displayTotal(quantity, price) {
    // console.clear();
    console.log("Your total: " + quantity * price);
    console.log("");
    inquirer.prompt([{
        type: 'list',
        name: "response",
        message: "Continue shopping?",
        choices: ["Yes", "No"]
    }]).then(function(answers) {
        if (answers.response === "Yes") {
            displayItems();
        } else {
            console.log("Thanks for shopping at BAmazon");
        }
    });
}

function testCase() {
    displayTotal()
}
// testCase();
displayItems();