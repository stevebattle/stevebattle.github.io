const { DataFactory } = n3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
const parser = new n3.Parser();
var store = new n3.Store();
var datasets = [];
// record added graphs
var graphs = new Set();
// function registry
var registry = [];
var counter = 0;
var refreshPending = false;

function uri(href, vocab, mappings) {
    // see http://urlregex.com
    //var regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ ;
    // modified to reject curies '://' is not optional after the scheme
    var regex = /((([A-Za-z]{3,9}:(?:\/\/))(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    if (href.match(regex)) {
        return href;
    }
    else if (href.indexOf(':') >= 0) {
        var tokens = href.split(/:/);
        return mappings[tokens[0]] + tokens[1];
    }
    return vocab + href;
}

function register(fn) {
    registry.push(fn);
}

// refresh called when processing reaches a leaf node in the DOM tree
function refresh() {
    refreshPending = true;
}

// loop called at fixed frequency
function loop(time) {
    if (refreshPending) {
        refreshPending = false;
        registry.forEach(function(f) { f(0); });
    }
    else {
        // call registered functions with loop count
        var c = ++counter;
        registry.forEach(function(f) { f(c); });
    }
    setTimeout(loop.bind(null,time), time);
}

// RDFa processing rules: https://www.w3.org/TR/rdfa-core/

function processRDFa(value, localDefaultVocabulary, localMappings, parentSubject, currentPropertyValue, reverse) {
    var newSubject = null;

    // rule 2
    if (value.attr('vocab')) localDefaultVocabulary = value.attr('vocab');

    // rule 3
    if (value.attr('prefix')) {
        var tokens = value.attr('prefix').split(/\s+/);
        for (var i = 0; i < tokens.length; i += 2) {
            var prefix = tokens[i].substring(0, tokens[i].indexOf(':'));
            localMappings[prefix] = tokens[i + 1];
        }
    }

    // hold rdfa expansion
    if (value.hasClass('hold')) {
        // save context
        if (localDefaultVocabulary) value.attr('vocab',localDefaultVocabulary);
        var m = null
        for (k in localMappings) {
            if (m) m += " ";
            else m = "";
            m += k + ': ' + localMappings[k];
        }
        if (m) value.attr('prefix',m);
        if (!value.attr('about') && parentSubject) value.attr('about',parentSubject);
        if (!value.attr('rel') && !value.attr('rev') && !value.attr('property')) {
            value.attr(reverse?'rev':'rel',currentPropertyValue);
        }
        refresh(); // pseudo leaf node
        return;
    }

    // process added dataset property
    if (value.attr('dataset')) {
        var dataset = value.attr('dataset');

        // is a pattern specified
        // eg. "http://keynsham.github.io/character".replace(new RegExp("^(.*?)$"), "$1.nq");
        if (value.attr('dataset-pattern')) {
            dataset = parentSubject.replace(new RegExp(value.attr('dataset-pattern')), dataset);
            // show dataset with replacements
            value.attr('dataset', dataset);
        }

        if (!datasets.includes(dataset)) {
            datasets.push(dataset);
            // each parse needs a fresh parser
            var parser = new n3.Parser();
            // is it in local storage?
            var data;
            if (Storage!='undefined' && (data=localStorage.getItem(dataset))) {
                parser.parse(data, (error, quad, prefixes) => {
                    if (error) {
                        console.log(error);
                    }
                    else if (quad) {
                        store.addQuad(quad);
                        if (quad.graph && !graphs.has(quad.graph.id))
                            graphs.add(quad.graph.id);
                    }
                    else {
                        console.log("local storage: ",store.countQuads(null, null, null, null));
                        processRDFa(value, localDefaultVocabulary, localMappings, parentSubject, currentPropertyValue, reverse);
                    }
                });
            }
            else {
                $.get(dataset, function (data) { 
                    if (Storage!='undefined') { // save locally
                        localStorage[dataset] = data;
                    }
                    parser.parse(data, (error, quad, prefixes) => {
                        if (error) {
                            console.log(error);
                        }
                        else if (quad) {
                            store.addQuad(quad);
                            if (quad.graph && !graphs.has(quad.graph.id))
                                graphs.add(quad.graph.id);
                        }
                        else {
                            console.log("datadock: ",store.countQuads(null, null, null, null));
                            processRDFa(value, localDefaultVocabulary, localMappings, parentSubject, currentPropertyValue, reverse);
                        }
                    });
                });
            }
            return;
        }
    }

    // rule 5
    // establish a value for new subject.
    if (value.attr('about') || value.attr('about') === "") newSubject = value.attr('about');
    else if (value.attr('resource')) newSubject = value.attr('resource');
    else if (value.attr('href')) newSubject = value.attr('href');
    else if (value.attr('src')) newSubject = value.attr('src');
    if (newSubject || newSubject === "") currentPropertyValue = null;

    // rule 6
    // establish both a value for new subject and a value for current object resource
    if (value.attr('resource') == "") currentObject = 'resource';
    else if (value.attr('href') == "") currentObject = 'href';
    else if (value.attr('src') == "") currentObject = 'src';
    else if (value.attr('typeof')) currentObject = 'typeof';
    else currentObject = null;

    if (value.attr('rel')) {
        currentPropertyValue = uri(value.attr('rel'), localDefaultVocabulary, localMappings);
        reverse = false;
    }
    else if (value.attr('rev')) {
        currentPropertyValue = uri(value.attr('rev'), localDefaultVocabulary, localMappings);
        reverse = true;
    }
    else if (value.attr('property')) {
        currentPropertyValue = uri(value.attr('property'), localDefaultVocabulary, localMappings);
        reverse = false;
    }

    // support auto-generated resource names to fix broken links
    if (value.attr('resource') && value.attr('resource-pattern')) {
        newSubject = parentSubject.replace(new RegExp(value.attr('resource-pattern')), value.attr('resource'));
        // show resource with replacements
        value.attr('resource', newSubject);
    }

    // rule 13
    if (newSubject) {
        parentSubject = newSubject;
    }

    var literalQuery = currentPropertyValue && ($(value).attr('content') === "" || 
        ($(value).children().length == 0 && !$(value).text()));
    var objectQuery = currentPropertyValue && currentObject;

    // query
    if (objectQuery || literalQuery) {
        var results;
        if (reverse) {
            results = store.getSubjects(currentPropertyValue, parentSubject, null);
        } else results = store.getObjects(parentSubject, currentPropertyValue, null);

        var cloned = false;
        $(results).each(function (index, o) {
            var clone = $(value).clone();
            clone.appendTo($(value).parent());
            cloned = true;
            var subject = parentSubject;
            if (o.termType == 'Literal') { // literal or datatype property
                // if the element is 'required' then whitespace is eliminated
                //if (o.value.trim() || !value.hasClass('required')) {
                // use content attribute where defined otherwise add value to element content
                if (clone.attr('content') === "") clone.attr('content', o.value);
                else clone.text(o.value);
                clone.addClass('instantiated');
                //}
            }
            else if (o.termType == 'NamedNode') { // object property
                if (currentObject!='typeof') clone.attr(currentObject, o.id);
                subject = o.id;
            }
            if (clone.children().length==0) refresh(); // leaf element
            else clone.children().each(function () {
                processRDFa($(this), localDefaultVocabulary, localMappings, subject, null, reverse);
            })
        });

        // delete the original value (no element remains if there is no match)
        $(value).remove();
    }
    else {
        // fill in about, href & src using parent subject (repeat the subject)
        if (value.attr('about') === "") value.attr('about', parentSubject);
        if (currentObject && value.attr(currentObject) === "") value.attr(currentObject, parentSubject);

        if (value.children().length==0) refresh(); // leaf element
        else value.children().each(function () {
            processRDFa($(this), localDefaultVocabulary, localMappings, parentSubject, currentPropertyValue, reverse);
        });
    }
}

function process(here,time) {
    processRDFa(here, null, {}, document.URL, null, false);
    if (time) setTimeout(loop.bind(null,time), time);
}
