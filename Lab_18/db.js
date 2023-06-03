const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  username: 'sa',
  password: 'r00t.R00T',
  database: 'Univer',
  host:     'localhost',
  dialect:  'mssql',
  logging: false,
  pool:
    {
        max: 10,
        min: 0,
        idle: 10000
    },
  define: 
  {
    timestamps: false,
    hooks: {
      beforeBulkDestroy(attributes, options) {
        console.log("--- default beforeDelete hook ---");
      },
    },
  },
});

module.exports = sequelize;