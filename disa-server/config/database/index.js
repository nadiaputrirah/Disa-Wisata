// (1) Import package mongoose
const mongoose = require("mongoose");
// (2) Import konfigurasi terkait MongoDB dari `app/config.js`
const { dbHost, dbName, dbPort, dbUser, dbPass } = require("../config");
// (3) Connect ke MongoDB menggunakan konfigurasi yang telah diimpor
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })

  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
// (4) Simpan koneksi dalam constant `db`
const db = mongoose.connection;
// (5) Export `db` supaya bisa digunakan oleh file lain yang membutuhkan
module.exports = db;

// const mongoose = require("mongoose");
// const { dbHost, dbPort, dbName, dbUser, dbPassword } = require("../config");

// mongoose.connect(
//   `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
// );
// const db = mongoose.connection;
// // db.on('open', () => {
// //     // server.listen(port);
// //     // server.on('error', onError);
// //     // server.on('listening', onListening);
// //     console.log('Connected to MongoDB');
// // });
// module.exports = db;
