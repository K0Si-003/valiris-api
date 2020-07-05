const db = require('../db.js');

class Availabilities {
  static async getById (apartmentId) {
    return db.query('SELECT apartment.name, booking.id, DATE_FORMAT(starting_date, "%Y-%m-%d") as starting_date, DATE_FORMAT(booking.ending_date, "%Y-%m-%d") as ending_date, id_apartment FROM booking JOIN apartment ON apartment.id = booking.id_apartment WHERE id_apartment = ?', [apartmentId])
      .then(rows => rows || null);
  }

  static async getAll () {
    return db.query(`
    SELECT 
    apartment.name, 
    booking.id, 
    DATE_FORMAT(starting_date, "%Y-%m-%d") as starting_date, 
    DATE_FORMAT(booking.ending_date, "%Y-%m-%d") as ending_date, 
    id_apartment, 
    contact.firstname, 
    contact.lastname 
    FROM booking JOIN apartment ON apartment.id = booking.id_apartment 
    JOIN contact ON contact.id = booking.id_contact`)
    .then(rows => rows || null );
  }
}

module.exports = Availabilities;
