const redis=require('redis');
const client=redis.createClient();

client.connect();
client.on('connect', async () => {
    console.log('connect');
    console.log('________________________\n');
});

client.on('error',function(err){
    console.log('Error '+ err);
});

client.on('connect', async () => {
    console.log('\tSET: ');
    console.time();
    for (let i = 0; i < 10000; i++) {
        await client.set(`${i}`, `value:${i}`);
    }
    console.timeEnd();
    console.log('________________________\n');

    console.log('\tGET: ');
    console.time();
    for (let i = 0; i < 10000; i++) {
        await client.get(`${i}`);
    }
    console.timeEnd();
    console.log('________________________\n');

    console.log('\tDEL: ');
    console.time();
    for (let i = 0; i < 10000; i++) {
        await client.del(`${i}`);
    }
    console.timeEnd();
    console.log('________________________\n');

    await client.disconnect().then(() => console.log('disconnect'));
});