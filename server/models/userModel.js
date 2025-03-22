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
      role: {
        type: DataTypes.ENUM("Alumno", "Jefatura", "Control Escolar", "Profesor"),
        allowNull: false,
      },
      matricula: {
        type: DataTypes.STRING(20),
        allowNull: true, // Default allows null
        validate: {
          // Custom validation to allow matricula to be null only for 'Profesor', 'Control Escolar', or 'Jefatura'
          isValidMatricula(value) {
            if (this.role === 'Alumno' && value) {
              // Prevent matricula from being provided for 'Alumno'
              throw new Error("Matricula is not allowed for 'Alumno' role.");
            }
            if ((this.role === 'Profesor' || this.role === 'Control Escolar' || this.role === 'Jefatura') && !value) {
              // Allow matricula to be null for 'Profesor', 'Control Escolar', and 'Jefatura'
              return true;
            }
            if (this.role !== 'Alumno' && !value) {
              // Matricula is required for roles other than 'Alumno'
              throw new Error("Matricula is required for roles other than 'Alumno'.");
            }
          }
        }
      },      
      numeroTrabajador: {
        type: DataTypes.STRING(20),
        allowNull: true, // Default 'true', but we will add custom validation
        validate: {
          // Custom validation to allow null only when role is 'Alumno'
          isValidNumeroTrabajador(value) {
            if (this.role !== 'Alumno' && !value) {
              throw new Error("Numero de trabajador is required for roles other than 'Alumno'.");
            }
          }
        },
      }
    },
  }, {
    freezeTableName: true, // To avoid Sequelize pluralizing the table name
    timestamps: true, // If you want to track createdAt and updatedAt
  });

  return User;
};
