// npm install mysqljs/mysql
// npm install inquirer

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

var currentProduct = []
var order = []

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    //    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
});

// Running this application will first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.
function readProducts() {
    var query = "SELECT * FROM products"
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item id: " +
                res[i].item_id +
                " || Product name: " +
                res[i].product_name +
                " || Price: " +
                res[i].price
//                +
//                " || stock: " +
//                res[i].stock_quantity
            )
            currentProduct.push(res[i]);
        };
        orderProcess()
    });
}

// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
function orderProcess() {
    inquirer
        .prompt([
            {
                name: "item_id",
                type: "input",
                message: "Enter the Product ID you would like to buy: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "units",
                type: "input",
                message: "Enter quantity of the product you would like to buy: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) { 
//           console.log(currentProduct)
            var j = answer.item_id - 1;
            var remainingQuantiry = currentProduct[j].stock_quantity - parseInt(answer.units);
//           console.log(remainingQuantiry);
            if (remainingQuantiry > 0) {
                var total = currentProduct[j].price * parseInt(answer.units);
                console.log("====================================")
                console.log("YOUR ORDER");
                console.log("Item: " + currentProduct[j].product_name);
                console.log("Price: " + currentProduct[j].price);
                console.log("Quantity: " + parseInt(answer.units));
                console.log("Order total: " + total);
                console.log("====================================")

                var updateQuery = "UPDATE products SET ? WHERE ?"
                connection.query(updateQuery,
                    [
                        {
                            stock_quantity: remainingQuantiry
                        },
                        {
                            item_id: answer.item_id
                        }
                    ],
                    function (error) {
                        if (error) throw error;
//                        console.log("Stock quantity is updated successfully!");
                        choice();
                    }
                );
            } else {
                console.log("Sorry but insufficient quantity!")
                choice();
            }
        }
        );
}

function choice() {
    inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do next?",
      choices: [
        "Continue to buy more!",
        "Proceed to checkout!"
      ]
    })
    .then(function (answer) {
        switch (answer.choice) {
            case "Continue to buy more!":
            console.log("ENJOY!")
            readProducts();
            break;

            case "Proceed to checkout!":
            console.log("Thank you for your purchase!")
            connection.end();
            break;
        }
    })
}

