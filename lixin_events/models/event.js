const sql = require("mssql");
const dbConfig = require("../dbConfig/lixin_dbConfig");

class Event {
  constructor(eventID, eventType, eventDate, eventTime, eventLocation, adminID) {
    this.eventID = eventID;
    this.eventType = eventType;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.eventLocation = eventLocation;
    this.adminID = adminID;
  }

  static async getEventByID(eventID) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT *
        FROM Events
        WHERE EventID = @eventID
      `;
      const result = await connection.request()
        .input('eventID', eventID)
        .query(query);
      
      if (result.recordset.length > 0) {
        const { EventID, EventType, EventDate, EventTime, EventLocation, AdminID } = result.recordset[0];
        return new Event(EventID, EventType, EventDate, EventTime, EventLocation, AdminID);
      } else {
        throw new Error(`Event with ID ${eventID} not found`);
      }
    } catch (error) {
      throw new Error(`Error retrieving event: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async getAllEvents() {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT *
        FROM Events
        ORDER BY EventDate DESC, EventTime ASC
      `;
      const result = await connection.request().query(query);
      
      const events = result.recordset.map(row => {
        const { EventID, EventType, EventDate, EventTime, EventLocation, AdminID } = row;
        return new Event(EventID, EventType, EventDate, EventTime, EventLocation, AdminID);
      });

      return events;
    } catch (error) {
      throw new Error(`Error retrieving events: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async createEvent(eventData) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        INSERT INTO Events (EventType, EventDate, EventTime, EventLocation, AdminID)
        VALUES (@eventType, @eventDate, @eventTime, @eventLocation, @adminID);
        SELECT SCOPE_IDENTITY() AS eventID;
      `;
      const result = await connection.request()
        .input('eventType', eventData.eventType)
        .input('eventDate', eventData.eventDate)
        .input('eventTime', eventData.eventTime)
        .input('eventLocation', eventData.eventLocation)
        .input('adminID', eventData.adminID)
        .query(query);

      const eventID = result.recordset[0].eventID;
      return await this.getEventByID(eventID);
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async deleteEvent(eventID) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        DELETE FROM Events
        WHERE EventID = @eventID
      `;
      const result = await connection.request()
        .input('eventID', eventID)
        .query(query);

      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    } finally {
      await sql.close();
    }
  }
}

module.exports = Event;
