const sql= require("mssql")
const dbConfig=require("../dbConfig/klaris_dbConfig")
class Post {
    constructor(postID, title, content, pictureURL, postedOn, adminID, newEventID, eventType, eventDate, eventTime, eventLocation) {
        this.postID = postID;
        this.title = title;
        this.content = content;
        this.pictureURL = pictureURL;
        this.postedOn = postedOn;
        this.adminID = adminID;
        this.newEventID = newEventID;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.eventLocation = eventLocation;
    }
    static async createPost(newPostData) {
        try {
          const connection = await sql.connect(dbConfig);
          const query = `
            INSERT INTO Posts (Title, Content, PictureURL, NewEventID, EventType, EventDate, EventTime, EventLocation, AdminID)
            VALUES (@title, @content, @pictureURL, @newEventID, @eventType, @eventDate, @eventTime, @eventLocation, @adminID);
            SELECT SCOPE_IDENTITY() AS postID;`
            ;   
    
          const result = await connection.request()
            .input('title', sql.NVarChar, newPostData.title)
            .input('content', sql.NVarChar, newPostData.content)
            .input('pictureURL', sql.NVarChar, newPostData.pictureURL)
            .input('newEventID', sql.NVarChar, newPostData.newEventID)
            .input('eventType', sql.NVarChar, newPostData.eventType)
            .input('eventDate', sql.Date, newPostData.eventDate)
            .input('eventTime', sql.NVarChar, newPostData.eventTime)
            .input('eventLocation', sql.NVarChar, newPostData.eventLocation)
            .input('adminID', sql.NVarChar, newPostData.adminID)
            .query(query);
    
          const postID = result.recordset[0].postID;
          return await this.getPostById(postID);
        } catch (error) {
          throw new Error(`Error creating post: ${error.message}`);
        } finally {
          await sql.close();
        }
      }
   

    static async deletePost(postID) {
        try {
          const connection = await sql.connect(dbConfig);
          const query = `
            DELETE FROM Posts
            WHERE PostID = @postID
          `;
          const result = await connection.request()
            .input('postID', sql.Int, postID)
            .query(query);
    
          return result.rowsAffected[0] > 0;
        } catch (error) {
          throw new Error(`Error deleting post: ${error.message}`);
        } finally {
          await sql.close();
        }
    }
/*
    //method to get posts by admin ID
    static async getByAdminID(adminID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Posts WHERE adminID = @adminID`; 
        const request = connection.request();
        request.input("adminID", adminID);
        const result = await request.query(sqlQuery);
    }*/

    // Method to get a post by ID
    static async getPostById(postID) {
        try {
          console.log(`Getting post with ID: ${postID}`);
          const connection = await sql.connect(dbConfig);
          const query = `
            SELECT *
            FROM Posts
            WHERE PostID = @PostID
          `;
          const result = await connection.request()
            .input('PostID', sql.Int, postID)
            .query(query);
          
          console.log("Query executed successfully");
          console.log("Result:", result.recordset);
      
          if (result.recordset.length > 0) {
            const { PostID, Title, Content, PictureURL, postedOn, AdminID, NewEventID, EventType, EventDate, EventTime, EventLocation } = result.recordset[0];
            return new Post(PostID, Title, Content, PictureURL, postedOn, AdminID, NewEventID, EventType, EventDate, EventTime, EventLocation);
          } else {
            throw new Error(`Post with ID ${postID} not found`);
          }
        } catch (error) {
          console.error(`Error retrieving post: ${error.message}`);
          throw new Error(`Error retrieving post: ${error.message}`);
        } finally {
          await sql.close();
        }
      }  
    // Method to get all posts

    static async getAllPosts() {
        try {
          const connection = await sql.connect(dbConfig);
          const query = `
            SELECT *
            FROM Posts
            ORDER BY PostedOn DESC
          `;
          const result = await connection.request().query(query);
    
          const posts = result.recordset.map(row => {
            const { PostID, Title, Content, PictureURL, PostedOn, AdminID, NewEventID, EventType, EventDate, EventTime, EventLocation } = row;
            return new Post(PostID, Title, Content, PictureURL, PostedOn, AdminID, NewEventID, EventType, EventDate, EventTime, EventLocation);
          });
    
          return posts;
        } catch (error) {
          throw new Error(`Error retrieving posts: ${error.message}`);
        } finally {
          await sql.close();
        }
      }
}

module.exports = Post;
