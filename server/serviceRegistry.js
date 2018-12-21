'user strict'

class serviceRegistry{
    constructor(){
        this.service=[];
        this.timeout=30;
    }

    //add service to hashmap service
    addService(intent,ip,port){
        //key should be unique for each service 
        const key = intent;
        if(!this.service[key]){
            this.service[key]={};
            this.service[key].timestamp = Math.floor(new Date()/1000);
            this.service[key].ip=ip;
            this.service[key].intent=intent;
            this.service[key].port=port;
            console.log(`added service for intent: ${intent} for ip:${ip} and port: ${port} `);
            return;
        }
        this.service[key].timestamp = Math.floor(new Date()/1000);
        this.cleanUp();
        //console.log(this.service);
        //console.log(`updating the intent : ${intent} ip:${ip}`);
    }
    //delete service to hashmap service
    removeService(intent,ip,port){
        const key = intent+ip+port;
        delete this.service[key];
    }
    //return service from hashmap service
    getService(intent){
        this.cleanUp();
        for(let key in this.service){
            if(this.service[key].intent === intent)
            return this.service[key].intent;
        }
        console.log(`service: ${intent} not found in registry`);
        return null;
    }
    //remove intents not pinging  for more than 30 secs
    cleanUp(){
        const now = Math.floor(new Date()/1000);
        for(let key in this.service){
            if(this.service[key].timestamp+this.timeout<now){
                console.log(`removing service ${this.service[key]}`);
                delete this.service[key];
            }
        }
    }
}

module.exports=serviceRegistry;
