// npm install n3
// see: https://github.com/rdfjs/N3.js
var N3 = require('n3');
// npm install request
var request = require('request');

const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

//var url = 'https://datadock.io/keynsham/ndp/data/dataset/character.csv.nq';
query_property = 'http://purl.org/dc/terms/title';

parser = new N3.Parser();
store = N3.Store();

var options = {
    url: 'http://keynsham.github.io/character.nq',
    headers: {
        'Accept': 'application/n-quads'
    }
}

request(options,function (error, response, body) {
    console.log(response.statusCode);
    console.log(body);
    if (!error && response.statusCode == 200) {
        var data = body;
        // remove all stray zero-width no-break spaces (65279)
        data = data.replace(/\ufeff/g, "");
        parser.parse(data, (error, quad, prefixes) => {
            if (quad) {
                console.log(quad);
                store.addQuad(quad);
            }
            else {
                console.log("%d quads", store.countQuads());
                query_results = store.getQuads(null,namedNode(query_property),null,null)[0];
                console.log(query_results);
            }
        });

    }
});
