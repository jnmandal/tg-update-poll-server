'use strict'
const TelegramUpdateQueue = require('./telegram/queue');
const setWebhook = require('./telegram/updates').setWebhook;
const fetch = require('node-fetch');
const endpoint = require('./config').webhookEndpoint;

function activateWebhook(url) {
  return setWebhook(url).then(res => console.log(res))
}

function deactivateWebhook() {
  return setWebhook('').then(res => console.log(res))
}

/*
 * Data persistence
 * updates are generated on an interval
 * then stored in a queue
 */
function poll() {
  let updates = new TelegramUpdateQueue();
  updates.onEnqueue = (update) => {
    let updateAmount = updates.updates.length;
    console.log(`[${new Date()}] - Enqueued update_id: ${update.update_id}`);
    console.log(`[${new Date()}] - Updates In queue: ${updateAmount}`);
  }
  // check for updates every 800ms
  updates.listen(800);
  console.log('Beginning data persistence');

  // main loop
  setInterval(() => {
    if (updates.updates.length > 0) {
      let update = updates.dequeue();
      let updateAmount = updates.updates.length;
      console.log(`[${new Date()}] - Dequeued update_id: ${update.update_id}`);
      console.log(`[${new Date()}] - Updates In queue: ${updateAmount}`);
      forward(update);
    }
  }, 1);
}

/*
 * private function for app
 * forwards update to endpoint set in config.js
 */
function forward(update) {
  console.log(update)
  return fetch(endpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(update)
  }).then(res => res.json())
    .then(json => console.log(json));
}

module.exports = {
  poll,
  activateWebhook,
  deactivateWebhook
}
