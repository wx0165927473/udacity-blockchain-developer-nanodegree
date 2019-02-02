# RESTful Web API with Node.js Framework

A RESTful API using a Node.js framework that will interface with the private blockchain

## Dependencies

crypto-js 3.1.9-1
hapi 17.6.0
level 4.0.0
inert 5.1.0

## Endpoint documentation

### GET Block Endpoint

URL for getting a block by the height of block

Paramter: BlockHeight

Response: A block object in JSON format

```
http://localhost:8000/block/[blockheight]
```

#### Example

Example GET Response
For URL, http://localhost:8000/block/0

Repsonse:
```
{
"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3",
"height":0,
"body":"First block in the chain - Genesis block",
"time":"1530311457",
"previousBlockHash":""
}
```

### Post Block Endpoint

URL for adding a block with content in the payload

Paramter: block

Response: Added block object in JSON format

```
http://localhost:8000/block
```

#### Example

Example GET Response
For URL, http://localhost:8000/block
with body {"body": "Testing block with test string data"}

Response:
```
{
"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3",
"height":0,
"body":"First block in the chain - Genesis block",
"time":"1530311457",
"previousBlockHash":""
}
```

#### Validation
When posting to localhost:8000/block without any content on the payload, the your service doesn not create a block. Make sure you include content in the payload
