const express = require('express');
const fs = require('fs');
const v8 = require('v8');

const app = express();
const port = 3000;

const leaks = [];

app.get('/bloatMyServer', (req, res) => {
	const redundantObj = {
		memory: "leaked",
		joke: "meta"
	};

	[...Array(10000)].map(i => leaks.push(redundantObj));

	res.status(200).send({size: leaks.length})
});


function createHeapSnapshot() {
  const snapshotStream = v8.getHeapSnapshot();
  // It's important that the filename end with `.heapsnapshot`,
  // otherwise Chrome DevTools won't open it.
  const fileName = `${Date.now()}.heapsnapshot`;
  const fileStream = fs.createWriteStream(fileName);
  snapshotStream.pipe(fileStream);
}
app.get('/heapdump', (req, res) => {
	createHeapSnapshot();
		res.status(200).send({msg: "successfully took a heap dump"})
});

app.listen(port, () => {
	createHeapSnapshot();
});