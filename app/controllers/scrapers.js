'use strict';

var mongoose = require('mongoose'),
    ScraperDB = mongoose.model('ScraperSchema'),
    Scraper = require('../models/scraper');

/*
 * Scraper Controllers
 */
	Scraper.prototype.startSpooky = function( spooky ){
		spooky.start( this.querystring );
	};
	Scraper.prototype.setSpookyActions = function( spooky ){
		spooky.then(function () {
			// echo data
			this.emit( 'twitter', this.evaluate(function () {
				return $('*[data-nav="followers"] .js-mini-profile-stat').html();
			}));

			// send data through API call
				var wsurl = 'http://localhost:3000/scraper/update';
				this.evaluate(function( wsurl ) {
					// params
					var data = {
						'twitter': $('*[data-nav="followers"] .js-mini-profile-stat').html()
					};

					// api call
					try {
						//return JSON.parse(__utils__.sendAJAX(wsurl, 'GET', data, false));
						return __utils__.sendAJAX(wsurl, 'POST', data, false);
			        } catch (e) {}
				}, {wsurl: wsurl});
			// END: send data through API call

			// screen capture
			this.capture('captures/mabinogiTwitterLikes.png');
		});

		/*
		spooky.then(function () {
			var saveData = new ScraperDB ({
				twitter: { 
					likes: this.evaluate(function () {
						return $('*[data-nav="followers"] .js-mini-profile-stat').html();
					}) 
				}
			});
			saveData.save(function (err) {if (err) console.log ('Error on save!')});
		});
		*/
	};
	Scraper.prototype.runSpooky = function( spooky ){
		spooky.run();
	};
	Scraper.prototype.bindEvents = function( spooky ){
		spooky.on('error', function (e, stack) {
			console.error(e);

			if (stack) {
				console.log(stack);
			}
		});

		spooky.on('twitter', function (msg) {
		    console.log(msg);
		});

		spooky.on('log', function (log) {
			if (log.space === 'remote') {
				console.log(log.message.replace(/ \- .*/, ''));
			}
		});
	};
/* END: Scraper Controllers */

/*
 * Update and store data from spookyjs into mongoose
 */
exports.update = function(req, res) {
	var scraperData = {};
	
	var scraperData = new ScraperDB(req.body);
   		scraperData.twitter = req.body.twitter;

   	// save into db
    scraperData.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                scraperData: scraperData
            });
        } else {
            res.jsonp(scraperData);
        }
    });
};
exports.render = function(req, res) {
	var scraper = new Scraper('https://twitter.com/MabiOfficial');
		scraper.initSpooky();
	
	// render page
	res.render('scraper', {
		user: req.user ? JSON.stringify(req.user) : 'null'
	});
};
