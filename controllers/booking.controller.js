const Booking = require('../models/booking.model.js');

class BookingController {
  static async findAll (req, res) {
    try {
      const data = await Booking.getAll();
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving booking requests.'
      });
    }
  }

  static async findOne (req, res) {
    try {
      const data = await Booking.findById(req.params.id);
      res.send(data);
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Apartment with id ${req.params.id} not found.` });
      } else {
        console.log(err);
        res.status(500).send({ errorMessage: 'Error retrieving Apartment with id ' + req.params.id });
      }
    }
  }

  static async findAllInfos (req, res) {
    try {
      const data = await Booking.getAllInfos();
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while retrieving information requests.'
      });
    }
  }

  static async validateOne (req, res) {
    try {
      const data = await Booking.validateOne(req.body);
      res.status(200).send(data);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        errorMessage: 'An error happened while you tried to validate a booking.'
      });
    }
  }

  static async create (req, res) {
    try {
      console.log(req.body);
      const newBooking = await Booking.createBookingBack(req.body);
      res.status(201).send(newBooking);
    } catch (err) {
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the booking.'
      });
    }
  }

  static async updateOne (req, res) {
    if (!req.body) {
      res.status(400).send({ errorMessage: 'Content can not be empty!' });
    }
    try {
      const data = await Booking.updateById(req.params.id, req.body);
      res.status(200).send(data);
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({ errorMessage: `Booking with id ${req.params.id} not found.` });
      } else {
        console.log(err);
        res.status(500).send({ errorMessage: 'Error updating booking with id ' + req.params.id });
      }
    }
  }

  static async delete (req, res) {
    try {
      await Booking.remove(req.params.id);
      res.send({ message: 'Booking was deleted successfully!' });
    } catch (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found booking with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: 'Could not delete booking with id ' + req.params.id + err
        });
      }
    }
  }
}

module.exports = BookingController;
