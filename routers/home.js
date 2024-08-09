const express = require('express');

const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = {
	homeRouter,
};
