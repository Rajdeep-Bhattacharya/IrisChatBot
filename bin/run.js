'use strict'

const service = require('../server/service');

var http = require('http');
const server = http.createServer(service);
server.listen(3000);

server.on('listening', function () {
    console.log(`iris is listening on ${server.address().port} in ${service.get('env')} mode`)
    console.log('changes made will be committed');
});