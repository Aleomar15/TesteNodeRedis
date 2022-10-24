//Exemplo com defeito
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
    
        const cod_p = 602;//valor da chave primaria
        console.time("redissave");//cronometro
    //for(let i=0;i<500;i++){
            let candidatos = await client.get(`${cod_p}`);//ira jogar o valor no cache
        if (!candidatos) {//caso redis ser iniciado a primeira vez
            const [rows] = await conn.query(`select * from candidatos join ocupacao on ocupacao.cod_ocupacao = candidatos.cod_ocupacao where ocupacao.cod_ocupacao = ? limit 100 ` ,[cod_p]);//comando sql
            candidatos = rows[0];//ira armazenar no cache
            await client.set(`${cod_p}`, JSON.stringify(candidatos));
            console.log(candidatos.nome);
        }
        else
            console.log(JSON.parse(candidatos).nome);//caso exista chame diretamente no cache redis
    //}
    console.timeEnd("redissave");//fim do cronometro
        
})();