(async () => {

    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection("mysql://root:@localhost:3306/testredis");
    const redis = require('redis');
    const client = redis.createClient();//criar um client no servidor redis
    client.connect();

    client.on("error", (error) => {
        console.error(error);
    });

    const idCliente = 965;//valor da chave primaria
    console.time("redissave");//cronometro
    let cliente = await client.get(`${idCliente}`);//ira jogar o valor no cache
    if (!cliente) {//caso redis ser iniciado a primeira vez
        const [rows] = await conn.query(`select * from clientes where id=? limit 1`, [idCliente]);
        cliente = rows[0];
        await client.set(`${idCliente}`, JSON.stringify(cliente));//ira armazenar no cache
        console.log(cliente.nome);
    }
    else
        console.log(JSON.parse(cliente).nome);//caso exista chame diretamente no cache redis
    console.timeEnd("redissave");//fim do cronometro

})();