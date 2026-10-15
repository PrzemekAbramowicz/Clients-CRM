const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { Db } = require('../utlis/db');
const { createApp } = require('../index');

test('CRM: pages, validation, CRUD and persisted data', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'crm-test-'));
  const file = join(dir, 'clients.json');
  writeFileSync(file, '[]');
  const db = new Db(file);
  const server = createApp(db).listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (url, method, data) =>
    fetch(base + url, {
      method,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data),
    });
  try {
    assert.equal((await fetch(base + '/')).status, 200);
    assert.equal((await fetch(base + '/client/form/add')).status, 200);
    assert.equal((await fetch(base + '/missing')).status, 404);
    const client = {
      name: 'Test Client',
      mail: 'test@example.com',
      nextContactAt: '',
      notes: 'Test note',
      id: 'injected',
    };
    assert.equal((await request('/client', 'POST', client)).status, 201);
    const id = db.getAll()[0].id;
    assert.notEqual(id, 'injected');
    assert.match(await (await fetch(base + `/client/${id}`)).text(), /Test Client/);
    assert.equal((await fetch(base + `/client/form/edit/${id}`)).status, 200);
    assert.equal(
      (await request(`/client/${id}?_method=PUT`, 'POST', { ...client, name: 'Updated Client' }))
        .status,
      200
    );
    assert.equal(new Db(file).getOne(id).name, 'Updated Client');
    const saved = readFileSync(file, 'utf8');
    assert.equal(
      (await request(`/client/${id}?_method=PUT`, 'POST', { ...client, mail: 'bad' })).status,
      400
    );
    assert.equal(readFileSync(file, 'utf8'), saved);
    assert.equal((await request('/client/missing?_method=PUT', 'POST', client)).status, 404);
    assert.equal((await request('/client/missing?_method=DELETE', 'POST', {})).status, 404);
    assert.equal((await request(`/client/${id}?_method=DELETE`, 'POST', {})).status, 200);
    assert.equal((await fetch(base + `/client/${id}`)).status, 404);
    assert.deepEqual(new Db(file).getAll(), []);
    assert.equal(
      (await request('/client', 'POST', { name: 'Jan', mail: 'jan@example.com', notes: '' }))
        .status,
      400
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    rmSync(dir, { recursive: true, force: true });
  }
});

// Hosting imports the module instead of running `node index.js`.
test('Hosting entry point exports Express and renders independently of working directory', async () => {
  const app = require('../index');
  assert.equal(typeof app, 'function');
  assert.equal(typeof app.listen, 'function');
  const originalDirectory = process.cwd();
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    process.chdir(tmpdir());
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const route of ['/client', '/client/form/add']) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200);
      assert.match(await response.text(), /<!DOCTYPE html>/i);
    }
    const missing = await fetch(base + '/client/not-a-client');
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /Wróć do listy klientów/);
  } finally {
    process.chdir(originalDirectory);
    await new Promise((resolve) => server.close(resolve));
  }
});
