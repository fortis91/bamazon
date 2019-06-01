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
    var query = connection.query('SELECT * FROM products',
        function (err, rows) {
            // console.log(rows);
            if (err) {
                console.log(err.message);
            }
            for (row in rows) {
                console.log(rows[row].product_id + " " + rows[row].product_name + " " + rows[row].price);
            }
            console.log("");
            // prompt();
        }
    );
    // console.log(query.sql);
    connection.end();
}

module.exports = {
    allQuery: allQuery
};