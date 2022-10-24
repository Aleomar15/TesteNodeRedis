(async ()=>{

    const mysql = require("mysql2/promise");
    const conn = await mysql.createConnection("mysql://root:@localhost:3306/tse2022");
    console.log("Conectou no MySQL!");
    const redis = require('redis');
    const client = redis.createClient();//criar um client no servidor redis
    client.connect();
    
    client.on("error", (error) => {
        console.error(error);
    });
    
        const cod_p = 921;//valor da chave primaria
        console.time("redissave");//cronometro
    //for(let i=0;i<500;i++){
            let ocupacao = await client.get(`${cod_p}`);//ira jogar o valor no cache
        if (!ocupacao) {//caso redis ser iniciado a primeira vez
            const [rows] = await conn.query(`select * from ocupacao where cod_ocupacao = ?  ` ,[cod_p]);//comando sql
            ocupacao = rows[0];//ira armazenar no cache
            await client.set(`${cod_p}`, JSON.stringify(ocupacao));
            console.log(ocupacao.descricao);
        }
        else
            console.log(JSON.parse(ocupacao).descricao);//caso exista chame diretamente no cache redis
    //}
    console.timeEnd("redissave");//fim do cronometro
        
})();

