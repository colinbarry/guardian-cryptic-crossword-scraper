# guardian-cryptic-crossword-scraper
Downloads clues and solutions for Guardian cryptic crosswords into a CSV file.

Productivity guru Max Deutsch outlines [here](https://medium.com/@maxdeutsch/how-i-mastered-the-saturday-nyt-crossword-puzzle-in-31-days-fe6a094edccd) his technique for quickly mastering crossword. By aggregating the data from thousands of New York Times crosswords as plain text, he quickly studied massive amounts of clues and solutions.

Presented here is a program that downloads crossword clues and solutions from The Guardian's web-hosted cryptic crosswords and writes them to a local .CSV file.

Installation
============
`npm install`

Usage
=====
To run
`node index.js`

Flags
=====
`--output` the output CSV file. 

`--connections` the number of concurrent downloads. 2 by default

`--first` the id of the first crossword to download

`--last` the id of the last crossword to download

The id seems to refer to days since their first published crossword. Gaps exist, ids without puzzles, on days where crosswords were not published 

