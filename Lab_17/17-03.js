const redis=require('redis');
const client=redis.createClient();

client.on('error',function(err){
    console.log('Error '+err);
});

client.connect().then(async () => {
console.log('Connected to Redis');

await client.set('incr', 0);
console.time('INCR');
await dincr();
console.timeEnd('INCR');

console.time('DECR');
await ddecr();
console.timeEnd('DECR');

client.quit().then(() => {
    console.log('disconnect');
    });
});


async function dincr() {
    for (let i = 0; i < 10000; i++) {
        await client.incr('incr');
    }
}

async function ddecr() {
    for (let i = 0; i < 10000; i++) {
        await client.decr('decr');
    }
}