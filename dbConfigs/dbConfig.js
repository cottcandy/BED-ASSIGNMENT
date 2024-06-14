module.exports = {
    user: "assignment_lixin", // Replace with your SQL Server login username
    password: "29F988352t05", // Replace with your SQL Server login password
    server: "localhost",
    database: "bed_assignment_db",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };