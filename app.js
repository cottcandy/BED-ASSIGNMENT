const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
// Klaris

const postController = require('./klaris_admin/controllers/postController');
const adminController = require('./klaris_admin/controllers/adminController');
const validatePost = require('./klaris_admin/middlewares/validatePost');

// Lixin
const eventController = require("./lixin_events/controllers/eventController");
const lixin_dbConfig = require("./lixin_events/dbConfig/lixin_dbConfig");
const validateEvent = require("./lixin_events/middlewares/validateEvent");
const klaris_dbConfig = require("./klaris_admin/dbConfig/klaris_dbConfig");

// Nanditha


// Yulin



const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware); // Mount the static middleware


// Routes (Klaris)
app.get('/posts', postController.getAllPosts);
app.get('/posts/:id', postController.getPostById);
app.post('/posts', validatePost, postController.createPost);
app.delete('/posts/:id', postController.deletePost);

app.post('/admin/login', adminController.loginAdmin);
app.get('/admin/:id/posts', adminController.getAdminPosts);

// Routes (Lixin)
app.get("/events", eventController.getAllEvents);
app.get("/events/:id", eventController.getEventById);
app.post("/events", validateEvent, eventController.createEvent);
app.put("/events/:id", validateEvent, eventController.updateEvent); 
app.delete("/events/:id", eventController.deleteEvent); // DELETE an event

// Routes (Nanditha)


// Routes (Yulin)



app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(klaris_dbConfig); // ** not sure abt this
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
