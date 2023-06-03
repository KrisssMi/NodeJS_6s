const redis=require('redis');
const client=redis.createClient();

client.on('error',function(err){
    console.log('Error '+ err);
});

client.connect().then(async () => {
console.log('Connected to Redis');

await client.set('incr', 0);
console.time('HSET');
await Myhset();
console.timeEnd('HSET');

console.time('HGET');
await Myhget();
console.timeEnd('HGET');

client.quit().then(() => {
    console.log('disconnect');
    });
});

async function Myhset() {
    for (let i = 0; i < 10000; i++) {
        await client.hSet(`${i}`,'value',`val-${i}`);
    }
};

async function Myhget() {
    for (let i = 0; i < 10000; i++) {
        await client.hGet(`${i}`,'value')
    }
};