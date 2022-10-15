// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: "dkroy8790",
// });
// module.exports=pool.promise();

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize("node-complete", "root", "dkroy8790", {
//   dialect: "mysql",
//   host: "localhost",
// });
// module.exports=sequelize;

//monog db
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://deepak:palccet@nodecluster.nhmcuow.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getdb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
