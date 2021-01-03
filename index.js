const flags = require('flags');
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

function escape(text) {
	return text.replace(/"/g, '""');
}

function scrape(next, ostream) {
	const id = next();
	if (id === undefined) return;

	console.log(`trying crossword/${id}`);

	const uri = 'https://www.theguardian.com/crosswords/cryptic/' + id;
	const options = {
		uri: uri,
		transform: (body) => {
			return cheerio.load(body);
		}
	};

	rp(options)
		.then(($) => {
			let data = $('.js-crossword').attr('data-crossword-data');
			let obj = JSON.parse(data);
			for (let i = 0; i < obj.entries.length; ++i) {
				const entry = obj.entries[i];
				const row = `"${id}","${entry.number}","${entry.direction}","${escape(entry.clue)}","${entry.length}","${entry.solution}"\n`;
				fs.writeSync(ostream, row);
			}
			console.log(`got crossword/${id}`);
			scrape(next, ostream);
		})
		.catch((err) => {
			console.log(`skipped crossword/${id}`);
			scrape(next, ostream);
		});
}

function counter(from, to) {
	let curr = from;
	return function () {
		if (curr <= to) {
			return curr++;
		}
	};
}

flags.defineString('output', 'guardian-cryptics.csv', 'output file');
flags.defineNumber('connections', 2, 'concurrent connections');
flags.defineNumber('first', 28324, 'number of first crossword to download');
flags.defineNumber('last', 28331, 'number of last crossword to download');

flags.parse();

const output = flags.get('output');
const connections = flags.get('connections');
const first = flags.get('first');
const last = flags.get('last');

console.log(`downloading ${first}-${last} to ${output} with ${connections} connections`);

const file = fs.openSync(output, 'w');
fs.writeSync(file, 'CROSSWORD,NUMBER,DIRECTION,CLUE,LENGTH,SOLUTION\n');

const next = counter(first, last);
for (let i = 0; i < connections; ++i) {
	scrape(next, file);
}


