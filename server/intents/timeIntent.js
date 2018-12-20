'use strict'


module.exports.process = function process(intentData,callback){

    if(intentData.intent[0].value!=='time'){
        return callback(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
    }
    if(!intentData.location){
        return callback(new Error(`missing location in time intent`));
    }
    return callback(false,`I dont yet know the time at ${intentData.location[0].value}`); 
}