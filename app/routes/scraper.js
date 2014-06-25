'use strict';

// Scraper routes use scraper controller
var scraper = require('../controllers/scrapers');

module.exports = function(app) {
	// Scraper route
	app.get('/scraper', scraper.render);
	app.post('/scraper/update', scraper.update);
};
