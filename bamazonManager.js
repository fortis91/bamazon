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


function displayTotal(quantity, price) {
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

function subMenu() {
    inquirer.prompt([{
        type: 'list',
        name: 'response',
        message: '-------------------',
        choices: ['Main Menu', 'Exit']
    }]).then(function(answers) {
        switch (answers.response) {
            case 'Main Menu':
                displayMainMenu();
                break;
            case 'Exit':
                console.log('Goodbye');
                break;
        }
    });
}

function viewAllProducts() {
    console.clear();
    console.log('');
    var connection = createConnection();
    connection.query(`SELECT product_id as "ID", product_name as "Item", 
                        price as "Price", stock_quantity as "Qty" FROM products WHERE stock_quantity > 0`,
        function(err, rows) {
            if (err) {
                console.log(err.message);
            }
            console.log(columnify(rows));
            // if (message) {
            //     console.log(message);
            // } else {
            //     console.log("");
            // }
            // prompt();
        }
    );
    connection.end();
    subMenu();
    // inquirer.prompt([{
    //     type: 'list',
    //     name: 'response',
    //     message: '-------------------',
    //     choices: ['Main Menu', 'Exit']
    // }]).then(function (answers) {
    //     switch (answers.response) {
    //         case 'Main Menu':
    //             displayMainMenu();
    //             break;
    //         case 'Exit':
    //             console.log('Goodbye');
    //             break;
    //     }
    // });
}

function viewLowInventory() {
    console.log('view low inventory');
    subMenu();
}

function addToInventory() {
    console.log('add to inventory');
    // subMenu();
}

function addNewProduct() {
    console.log('add new product');
    // subMenu();
}

function displayMainMenu() {
    console.clear();
    inquirer.prompt([{
        type: 'list',
        name: "response",
        message: "BAmazon Main Menu",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
    }]).then(function(answers) {
        switch (answers.response) {
            case 'View Products for Sale':
                viewAllProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
            case 'Exit':
                console.log("Goodbye");
        }
    });
}

function test() {
    console.clear();
    displayMainMenu()
}
test();