/*\
title: $:/plugins/anicolao/tw5-firestore-sync/firestoreadaptor.js
type: application/javascript
module-type: syncadaptor

A sync adaptor module for synchronising with the user's own firestore instance.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

function FirestoreAdaptor(options) {
	var self = this;
	this.wiki = options.wiki;
	this.boot = options.boot || $tw.boot;
	this.logger = new $tw.utils.Logger("firestore",{colour: "red"});
}

FirestoreAdaptor.prototype.name = "firestore";

FirestoreAdaptor.prototype.supportsLazyLoading = false;

FirestoreAdaptor.prototype.isReady = function() {
	this.logger.log("isReady: true")
	return true;
};

let idCounter = 100;
FirestoreAdaptor.prototype.getTiddlerInfo = function(tiddler) {
	const tiddlerclone = tiddler.fields.title;
	this.logger.log(`getTiddlerInfo ${JSON.stringify(tiddlerclone)}`);
	return { id: ++idCounter };
};


let registered = false;
FirestoreAdaptor.prototype.getUpdatedTiddlers = function(syncer,callback) {
	if (!registered) {
		registered = true;
		this.logger.log(`getUpdatedTiddlers one callback to see the already registered message`);
		callback(null, {modifications: [], deletions: []});
	} else {
		this.logger.log(`getUpdatedTiddlers ignored, already registered`);
	}
}
FirestoreAdaptor.prototype.saveTiddler = function(tiddler,callback,options) {
	this.logger.log(`saveTiddler ${JSON.stringify(tiddler.getFieldStrings())}`);
	callback(null,null);
};

FirestoreAdaptor.prototype.loadTiddler = function(title,callback) {
	this.logger.log(`loadTiddler ${JSON.stringify(title)}`);
	callback(null,null);
};

FirestoreAdaptor.prototype.deleteTiddler = function(title,callback,options) {
	this.logger.log(`deleteTiddler ${JSON.stringify(title)}`);
	callback(null,null);
};

exports.adaptorClass = FirestoreAdaptor;

})();
