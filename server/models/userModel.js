const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255), // Store hashed password (255 characters for safety)
      allowNull: false,
      validate: {
        len: [6, 255], // Password length should be between 6 and 255 characters
      },
    },
  }, {
    freezeTableName: true, // To avoid Sequelize pluralizing the table name
    timestamps: true, // If you want to track createdAt and updatedAt
  });

  return User;
};
