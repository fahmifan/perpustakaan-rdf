#!/usr/bin/env node

const fs = require('fs');

const bookFile = fs.readFileSync('./input/data.json')
const books = JSON.parse(bookFile.toString())

function getCats(books) {
  let ncats = {};
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const bcats = b.Category.split(";").map(b => b.trim())

    for (let j = 0; j < bcats.length; j++) {
      const jbcat = bcats[j];
      ncats[jbcat] = i+"_"+j
    }
  }

  return ncats;
}

// create categories class
function createCategories(cats) {
  let bcats = '';
  Object.keys(cats).forEach(c => {
    cat = `
    :Cat_${cats[c]}  a :Category, owl:NamedIndividual ;
            :name   "${c.replace(/(\r\n|\n|\r)/gm,"")}"^^xsd:string .
    \n`
    bcats += cat;
  });

  return bcats;
}

function getPubs(books) {
  let pubs = {};
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    pubs[b.Publisher] = i+1
  }

  return pubs;
}

function createPubs(pubs) {
  let spubs = '';

  Object.keys(pubs).forEach(el => {
    p = `
    :Pub_${pubs[el]}
            a       :Publisher , owl:NamedIndividual ;
            :name   "${el.replace(/(\r\n|\n|\r)/gm,"")}"^^xsd:string .
    \n`

    spubs += p
  });

  return spubs;
}

function rmComma(index, str) {
  const before = str.substring(0, index)
  const after = str.substring(index+1, str.length)

  return  before + ' ' + after 
}

function getAuthor(books) {
  let auths = {};
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const comma = b.Author.indexOf(",")
    const a = comma ? rmComma(comma, b.Author) : b.Author
    auths[b.Author] = i+1
  }

  return auths;
}

function createAuthor(auths) {
  let sauths = ''
  Object.keys(auths).forEach(el => {
    const a = `
    :Auth_${auths[el]}  a  :Author , owl:NamedIndividual ;
            :name   "${el.replace(/(\r\n|\n|\r)/gm,"")}"^^xsd:string .
    \n`

    sauths += (a);
  });

  return sauths;
}

const header = () => {
  return `
      @prefix :      <http://www.semanticweb.org/boi/ontologies/2019/4/perpustakaan#> .
      @prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix owl:   <http://www.w3.org/2002/07/owl#> .
      @prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
      @prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
  
      <http://www.semanticweb.org/boi/ontologies/2019/4/perpustakaan>
              a       owl:Ontology .
  
      :archivedIn  a       owl:ObjectProperty ;
              rdfs:domain  :Book ;
              rdfs:range   :Library .
  
      :Book   a       owl:Class .
  
      :Library  a     owl:Class .
  
      :kindOf  a           owl:ObjectProperty ;
              rdfs:domain  :Book ;
              rdfs:range   :Category .
  
      :Category  a    owl:Class .
  
      :publishedBy  a      owl:ObjectProperty ;
              rdfs:domain  :Book ;
              rdfs:range   :Publisher .
  
      :Publisher  a   owl:Class .
  
      :writtenBy  a        owl:ObjectProperty ;
              rdfs:domain  :Book ;
              rdfs:range   :Author .
  
      :Author  a               owl:Class ;
              rdfs:subClassOf  :Person .
  
      :name   a            owl:DatatypeProperty ;
              rdfs:domain  :Book , :Library , :Category , :Publisher , :Author , :Person ;
              rdfs:range   xsd:string .
  
      :Person  a      owl:Class .
  
      :FMIPA  a       :Library , owl:NamedIndividual ;
              :name   "fakultas matematika dan ilmu pengetahuan alam" .
      \n
  `
}
  

function main() {
  const bcats = getCats(books);
  const bpubs = getPubs(books)
  const bauthor = getAuthor(books);
  let booksOwl = '';

  // create book
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const categories = b.Category.split(";");

    let cats = ''
    categories.forEach((c, i) => {
      // if last item, no comma
      if (i === categories.length - 1) {
        cats += `:Cat_${bcats[c]}`;
      } else {
        cats += `:Cat_${bcats[c]}, `;
      }
    });
    
    const bookOwl = `
    :Book_${i+1}  a   :Book , owl:NamedIndividual ;
            :archivedIn   :FMIPA ;
            :kindOf       ${cats} ;
            :name         "${b.Title.replace(/(\r\n|\n|\r)/gm,"")}"^^xsd:string ;
            :publishedBy  :Pub_${bpubs[b.Publisher]} ;
            :writtenBy    :Auth_${bauthor[b.Author]} .
    \n`;
  
    booksOwl += bookOwl

  }

  const owls = header() 
    + createCategories(bcats) 
    + createAuthor(bauthor) 
    + createPubs(bpubs) 
    + booksOwl;

  fs.writeFileSync('./output/perpustakaan.ttl', owls)
}

main();