
(async  ()=>{
    const db = require("./db");
    console.log("Select");
    console.time("dbsave");
    const teste = await db.selectCustomers();
    console.log(teste);
    console.timeEnd("dbsave");
})();


