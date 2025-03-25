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
    role: {
      type: DataTypes.ENUM("Alumno", "Jefatura", "Control Escolar", "Profesor"),
      allowNull: false,
    },
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: true, // Default allows null
      validate: {
        isValidMatricula(value) {
          if (this.role === 'Alumno' && !value) {
            throw new Error("Matricula is required for 'Alumno' role.");
          }
          if (this.role === 'Alumno' && value && this.numeroTrabajador) {
            throw new Error("Matricula and numero de trabajador cannot be provided together for 'Alumno' role.");
          }
          if ((this.role === 'Profesor' || this.role === 'Control Escolar' || this.role === 'Jefatura') && value) {
            throw new Error("Matricula is not allowed for 'Profesor', 'Jefatura', or 'Control Escolar' roles.");
          }
        }
      }
    },
    numeroTrabajador: {
      type: DataTypes.STRING(20),
      allowNull: true, // Default allows null
      validate: {
        isValidNumeroTrabajador(value) {
          if (this.role !== 'Alumno' && !value) {
            throw new Error("Numero de trabajador is required for roles other than 'Alumno'.");
          }
          if (this.role !== 'Alumno' && value && this.matricula) {
            throw new Error("Numero de trabajador and matricula cannot be provided together for 'Profesor', 'Jefatura' or 'Control Escolar' roles.");
          }
        }
      },
    }
  }, {
    freezeTableName: true, // To avoid Sequelize pluralizing the table name
    timestamps: true, // If you want to track createdAt and updatedAt
  });

  return User;
};
