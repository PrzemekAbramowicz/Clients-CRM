const { ValidationError } = require('../utlis/errors');

class ClientRecord {
  constructor(obj) {
    const { id, name, mail, nextContactAt, notes } = obj;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('ID musi być tektem');
    }

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      throw new ValidationError('Imię musi być tekstem o długości min. 3 znaków');
    }

    if (!mail || typeof mail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      throw new ValidationError('Email nieprawidłowy.');
    }

    if (typeof nextContactAt !== 'string') {
      throw new ValidationError('Data następnego kontaktu musi być tekstem');
    }

    if (typeof notes !== 'string') {
      throw new ValidationError('Notatki muszą być tekstem');
    }

    this.id = id;
    this.name = name.trim();
    this.mail = mail;
    this.nextContactAt = nextContactAt;
    this.notes = notes;
  }
}

module.exports = {
  ClientRecord,
};
