const { DataFactory } = n3 ;
const { namedNode, literal, defaultGraph, quad } = DataFactory ;
const parser = new n3.Parser() ;
var store = new n3.Store() ;
var datasets = [] ;
// record added graphs
var graphs = new Set() ;

function uri(href,vocab,mappings) {
// see http://urlregex.com
//var regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ ;
var regex = /((([A-Za-z]{3,9}:(?:\/\/))(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ ;
if (href.match(regex)) {
    return href ;
}
else if (href.indexOf(':')>=0) {
    var tokens = href.split(/:/) ;
    return mappings[tokens[0]] + tokens[1] ;
}
return vocab + href ;
}

// function refreshDependencies(graphs) {
//   var a = Array.from(graphs) ;
//   for (var i=0 ; i<a.length ; i++) {
//     // template literal to match graph name
//     var selector = `[graph-dependency='${a[i]}']` ;
//     $(selector).each(function() {
//       //var count = store.countQuads(null,null,null,a[i]) ;
//       console.log(datasets.length) ;
//       processRDFa($(this),null,[],null,null,false,false) ;
//     }) ;
//   }
// }

// RDFa processing rules: https://www.w3.org/TR/rdfa-core/

function processRDFa(value,localDefaultVocabulary,localMappings,parentSubject,currentPropertyValue,reverse,dependent) {
    var newSubject = null ;

    // process added dataset property
    if (value.attr('dataset')) {
    var dataset = value.attr('dataset') ;

    // is a pattern specified
    // eg. "http://keynsham.github.io/character".replace(new RegExp("^(.*?)$"), "$1.nq");
    if (value.attr('dataset-pattern')) {
        dataset = parentSubject.replace(new RegExp(value.attr('dataset-pattern')),dataset) ;
        // show dataset with replacements
        value.attr('dataset',dataset) ;
    }

    var graph = value.attr('graph') ;

    if (!datasets.includes(dataset)) {
        datasets.push(dataset) ;
        $.get(dataset, function(data) {
        console.log(dataset) ;
        // remove all stray zero-width no-break spaces (65279)
        //data = data.replace(/\ufeff/g, "");
        // remove blank lines
        data = data.replace(/^\s*[\r\n]/gm, '');
        data = data.replace(/^\s*[\n]/gm, '');
        // each parse needs a fresh parser
        var parser = new n3.Parser() ;
        parser.parse(data, (error, quad, prefixes) => {
            if (error) {
            console.log(error) ;
            }
            else if (quad) {
            console.log(quad.graph) ;
            store.addQuad(quad) ;
            if (quad.graph && !graphs.has(quad.graph.id)) 
                graphs.add(quad.graph.id) ;
            }
            else {
            console.log(store.countQuads(null,null,null,null)) ;
            processRDFa(value,localDefaultVocabulary,localMappings,parentSubject,currentPropertyValue,reverse,dependent) ;
            //refreshDependencies(graphs) ;
            }
        });
        });
        return ;
    }
    } 

    // rule 2
    if (value.attr('vocab')) localDefaultVocabulary = value.attr('vocab') ;

    // rule 3
    if (value.attr('prefix')) {
    var tokens = value.attr('prefix').split(/\s+/) ;
    for (var i=0 ; i<tokens.length ; i+=2) {
        var prefix = tokens[i].substring(0,tokens[i].indexOf(':')) ;
        localMappings[prefix] = tokens[i+1] ;
    }
    }

    // rule 5
    // establish a value for new subject.
    if (value.attr('about') || value.attr('about')==="") newSubject = value.attr('about') ;
    else if (value.attr('resource')) newSubject = value.attr('resource') ;
    else if (value.attr('href')) newSubject = value.attr('href') ;
    else if (value.attr('src')) newSubject = value.attr('src') ;
    if (newSubject || newSubject==="") currentPropertyValue = null ;

    // rule 6
    // establish both a value for new subject and a value for current object resource
    if (value.attr('resource')=="") currentObject = 'resource' ;
    else if (value.attr('href')=="") currentObject = 'href' ;
    else if (value.attr('src')=="") currentObject = 'src' ;
    else currentObject = null ;

    if (value.attr('rel')) {
    currentPropertyValue = uri(value.attr('rel'),localDefaultVocabulary,localMappings) ;
    reverse = false ;
    }
    else if (value.attr('rev')) {
    currentPropertyValue = uri(value.attr('rev'),localDefaultVocabulary,localMappings) ;
    reverse = true ;
    }
    else if (value.attr('property')) {
    currentPropertyValue = uri(value.attr('property'),localDefaultVocabulary,localMappings) ;
    reverse = false ;
    }

    // support auto-generated resource names to fix broken links
    if (value.attr('resource') && value.attr('resource-pattern')) {
    newSubject = parentSubject.replace(new RegExp(value.attr('resource-pattern')),value.attr('resource')) ;
    // show resource with replacements
    value.attr('resource',newSubject) ;         
    }

    // rule 13
    if (newSubject) {
    parentSubject = newSubject ;
    }

    // graph dependency - is this node dependent?
    if (value.attr('graph-dependency')) {
    dependent = true ;
    // add context to the element
    value.attr('about',parentSubject) ;
    }

    var literalQuery = currentPropertyValue && ($(value).attr('content')==="" || ($(value).children().length==0 && !$(value).text()) ) ;
    var objectQuery = currentPropertyValue && currentObject ;

    // query
    if (objectQuery || literalQuery) {
    var results ;
    if (reverse) {
        results = store.getSubjects(currentPropertyValue,parentSubject,null) ;
    } else results = store.getObjects(parentSubject,currentPropertyValue,null) ;
    $(results).each(function(index,o) {
        var clone = $(value).clone() ;
        clone.appendTo($(value).parent()) ;

        if (o.termType=='Literal') { // literal or datatype property
        // use content attribute where defined otherwise add value to element content
        if (clone.attr('content')==="") clone.attr('content',o.value) ;
        else clone.text(o.value) ;
        }
        else if (o.termType=='NamedNode') { // object property
        clone.attr(currentObject,o.id) ;
        clone.children().each( function() { 
            processRDFa($(this),localDefaultVocabulary,localMappings,o.id,null,reverse,dependent) ;
        })
        }

    }) ;

    // delete the original value (no element remains if there is no match)
    // elements below a dependent graph are preserved
    if (!dependent) $(value).remove() ;          
    }
    else {
    // fill in about, href & src using parent subject (repeat the subject)
    if (value.attr('about')==="") value.attr('about',parentSubject) ;
    if (currentObject && value.attr(currentObject)==="") value.attr(currentObject,parentSubject) ;
    
    value.children().each( function() { 
        processRDFa($(this),localDefaultVocabulary,localMappings,parentSubject,currentPropertyValue,reverse,dependent) ; 
    }) ;
    }
}

function rdfa(here) {
    processRDFa(here,null,{},document.URL,null,false,false) ;
}