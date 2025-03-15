const sql = require("mssql")

// Configure the connection
const config = {
  server:  'localhost',
  database:  "creditos",
  port: 1433,
  authentication: {
    type: 'default',
    options: {
      userName: 'adminTeso',     
      password: 'administrador123',  
    },
  },
  options: {
    enableArithAbort: true, // Required option for Node.js applications
    trustServerCertificate: true,
    trustedConnection: true, 
    instancename:  'SQLEXPRESS' 

  }
}

// Establish a connection to the database
sql.connect(config, (err) => {
  if (err) {
    console.error("Error connecting to SQL Server:", err)
    return
  }

  console.log("Connected to SQL Server!")

  // Perform database operations here

  // Close the connection when done
  sql.close()
})
