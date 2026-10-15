const { readFileSync, writeFileSync, renameSync } = require('node:fs');
const { join } = require('node:path');
const { randomUUID } = require('node:crypto');
const { ClientRecord } = require('../records/client-record');
const { NotFoundError } = require('./errors');

class Db {
  constructor(dbFileName = join(__dirname, '../data/client.json')) {
    this.dbFileName = dbFileName;
    this._data = JSON.parse(readFileSync(dbFileName, 'utf8')).map((obj) => new ClientRecord(obj));
  }

  _save(data) {
    // Replace the file only after the complete new contents have been written.
    const temporaryFile = `${this.dbFileName}.tmp`;
    writeFileSync(temporaryFile, JSON.stringify(data, null, 2), 'utf8');
    renameSync(temporaryFile, this.dbFileName);
    this._data = data;
  }

  create(obj) {
    const id = randomUUID();
    this._save([...this._data, new ClientRecord({ ...obj, id })]);
    return id;
  }

  getAll() {
    return this._data;
  }
  getOne(id) {
    return this._data.find((client) => client.id === id);
  }

  update(id, changes) {
    const current = this.getOne(id);
    if (!current) throw new NotFoundError();
    const updated = new ClientRecord({ ...current, ...changes, id });
    this._save(this._data.map((client) => (client.id === id ? updated : client)));
  }

  delete(id) {
    if (!this.getOne(id)) throw new NotFoundError();
    this._save(this._data.filter((client) => client.id !== id));
  }
}

module.exports = { Db };
