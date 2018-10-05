#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const watcher = require('./actions/watch/watch-game');
const builder = require('./actions/build/build-game');

const watch = !!argv.watch;
const prod = !!argv.prod;
const gameId = argv.id;
const clean = typeof argv.clean === 'undefined' ? true : !!argv.clean;

if (!gameId)
    throw new Error('no --id given');

if (watch, clean) {
    watcher(gameId, clean).catch(console.error);
} else {
    builder(gameId, prod);
}