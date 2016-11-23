// https://github.com/tonistiigi/audiosprite
// constructor options are audiosprite options

var path = require('path');
var fs = require('fs');
var deasync = require('deasync');
var audiosprite = require('audiosprite');

function packer(options) {
	this.options = {
		export: 'ogg,mp3',
		format: 'howler',
		log: 'warning'
	};
	if(options)
		for(var attr in options) this.options[attr] = options[attr];
}

packer.prototype.pack = function(packId, files, destPath) {
	var audiofiles = [];
	for (var id in files) {
		audiofiles.push(files[id]);
	}

	var output = path.join(destPath, packId);

	// copy options
	var opts = {
		output: output
	};
	for(var attr in this.options) opts[attr] = this.options[attr];

	// create the audio sprite
	var done = false;
	audiosprite(audiofiles, opts, function(err, obj) {
		if (err) return console.error(err);

		fs.writeFileSync(output+'.json', JSON.stringify(obj, null, 2));

		done = true;
	});
	deasync.loopWhile(function() { return !done; });

	return {
		json: packId + '.json'
	};
};

module.exports = packer;
