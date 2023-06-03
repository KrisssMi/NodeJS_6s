const redis = require("redis");
const client = redis.createClient(6379);

client.on('subscribe', (channel, count)=>{console.log('subscribe:', ' channel = ', channel, 'count = ', count);});
client.on('message', (channel, message)=>{console.log('sub channel: ' + channel + ': ' + message);});
client.subscribe('channel-01');

setTimeout(()=>{
    client.unsubscribe(); 
    client.quit();
}, 10000);