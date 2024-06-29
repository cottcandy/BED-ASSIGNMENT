const dbConfig = require("../dbConfig/klaris_dbConfig");

class Post {
    constructor(postID, title, content, pictureURL, adminID, newEventID, eventType, eventDate, eventTime, eventLocation) {
        this.postID = postID;
        this.title = title;
        this.content = content;
        this.pictureURL = pictureURL;
        this.adminID = adminID;
        this.newEventID = newEventID;
        this.eventType = eventType;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.eventLocation = eventLocation;
    }

    static async create(title, content, pictureURL, adminID, newEventID, eventType, eventDate, eventTime, eventLocation) {
        const result = await db.query('INSERT INTO Posts (Title, Content, PictureURL, AdminID, NewEventID, EventType, EventDate, EventTime, EventLocation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, content, pictureURL, adminID, newEventID, eventType, eventDate, eventTime, eventLocation]);
        if (result.affectedRows > 0) {
            return new Post(result.insertId, title, content, pictureURL, adminID, newEventID, eventType, eventDate, eventTime, eventLocation);
        }
        return null;
    }

    static async delete(postID) {
        const result = await dbConfig.query('DELETE FROM Posts WHERE PostID = ?', [postID]);
        return result.affectedRows > 0;
    }

    static async getByAdmin(adminID) {
        const posts = await dbConfig.query('SELECT * FROM Posts WHERE AdminID = ?', [adminID]);
        return posts.map(post => new Post(post.PostID, post.Title, post.Content, post.PictureURL, post.AdminID, post.NewEventID, post.EventType, post.EventDate, post.EventTime, post.EventLocation));
    }
}

module.exports = Post;
