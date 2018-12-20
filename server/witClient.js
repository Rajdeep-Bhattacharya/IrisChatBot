'use strict'

module.exports=function witCLient(token){
    const ask = function ask(message){
        console.log(`ask:`+message);
        console.log(`token:`+token);
    }
    return{ask:ask};
}