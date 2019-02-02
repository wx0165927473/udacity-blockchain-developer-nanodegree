'use strict';

const Hapi = require('hapi');
const ls = require('./levelSandbox')
const SHA256 = require('crypto-js/sha256')
const Blockchain = require('./simpleChain')
const Block = require('./block')

const chain = new Blockchain()

// Create a server with a host and port
const server = Hapi.server({
    host:'localhost',
    port:5050
});

// Route functions
var handlers = {
    post: async (request, reply) => {
        const jsonObj = JSON.parse(request.payload)
        const body = jsonObj.body

        if (body === undefined || body === null || body.length == 0) {
            return 'Error: Body is not provided or empty'
        }

        const block = new Block(body)
        console.log(body)
        await chain.addBlock(block)
        return block
    },
  
    get: async (request, reply) => {
        let height = encodeURIComponent(request.params.height)
        let block = await chain.getBlock(height)
            .then(block => {
                if (block === undefined || block === null) {
                    return `Error: Block with height of ${encodeURIComponent(request.params.height)} does not exist`
                }
                else {
                    return block
                }
            })
            .catch(error => {
                console.log(error)
            })

            return block
    },

    greet: (request, reply) => {
        return reply.file('./README.md');
    }
  };

// Add the route
server.route([
    { path: '/', method: 'GET', handler: handlers.greet },
    { path: '/block', method: 'POST', handler: handlers.post },
    { path: '/block/{height}', method: 'GET', handler: handlers.get }
]);

// Start the server
async function start() {
    try {
        await server.register(require('inert'));
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();