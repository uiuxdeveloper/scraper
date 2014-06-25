'use strict';

var Spooky = require('../../node_modules/spooky/lib/spooky'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
 * Scraper Model
 */
    // set db schema
    var ScraperSchema = new Schema({
        twitter: {}
    });

    var Scraper = function(querystring){
        // set default params
        this.command = "/casperjs/batchbin/casperjs.bat";   // relative path to casper directory within project 
                                                            // (Windows environment uses casperjs.bat)
        this.transport = 'http';
        this.logLevel = 'debug';
        this.verbose = true;
        this.clientScripts = ['/public/js/lib/jquery/dist/jquery.min.js'];

        // set virtual params
        this.querystring = querystring;
    };

    Scraper.prototype.initSpooky = function(){
        var that = this,
            spooky = new Spooky({
                child: {
                    command:        that.getParamValue('command'),
                    transport:      that.getParamValue('transport')
                },
                casper: {
                    logLevel:       that.getParamValue('logLevel'),
                    verbose:        that.getParamValue('verbose'),
                    clientScripts:  that.getParamValue('clientScripts'),
                }
            }, function (err) {
                if (err) {
                    e = new Error('Failed to initialize SpookyJS');
                    e.details = err;
                    throw e;
                }

                that.startSpooky( spooky );
                that.setSpookyActions( spooky );
                that.runSpooky( spooky );
            });

        this.bindEvents( spooky );
    };

    Scraper.prototype.getParamValue = function( val ){
        return Scraper[val];
    };

    module.exports = Scraper;
    mongoose.model('ScraperSchema', ScraperSchema);
/* Scraper Model */