const redis = require('redis')
let client = redis.createClient();

client.on('error', function (err) {
  console.log('Error ' + err)
})

client.connect().then(async () => {
  console.log('connect');
  client.set('first', 'Kristina');
  client.set('second', 'Natasha');
  console.log(await client.get('first'));
  client.quit().then(() => {
    console.log('disconnect');
  });
});