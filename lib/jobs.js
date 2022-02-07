// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

const schedule = require('node-schedule');
const connect = require('./connect');


function get_data_from_api(workName, cronString, workerFunction){
    //http client get the fetch data from api
}


module.exports =  function(){
    
    get_data_from_api("instagram_comments_test_0","1 * * * * *",()=>{
        const fetch_test = require('../fetch/test');
        fetch_test("", "", "").then(r => {
            console.log("ok")
        })
    })

    get_data_from_api("instagram_comments_fetch_1","30 * * * * *",()=>{
        const fetch_test = require('../fetch/test');
        fetch_test("", "", "").then(r => {
            console.log("ok")
        })
    })
}





module.exports()