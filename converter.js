#!/usr/bin/env node

const fs = require('fs');

const books = [
  {
    "No": 1,
    "Title": "advanced engineering mathematics",
    "Author": "kreyszig,erwin",
    "Library": "fakultas matematika dan ilmu pengetahuan alam",
    "Publisher": "john wiley and sons",
    "Category": "mathematic; engineering; database management"
  },
  {
    "No": 2,
    "Title": "mathematics for the technologies with calculus",
    "Author": "clar,lawrence m",
    "Library": "fakultas matematika dan ilmu pengetahuan alam",
    "Publisher": "prentice hall",
    "Category": "calculus; mathematic"
  },
  {
    "No": 3,
    "Title": "discrete mathematics with combinatoric",
    "Author": "anderson,james a",
    "Library": "fakultas matematika dan ilmu pengetahuan alam",
    "Publisher": "prentice hall",
    "Category": "discrete; mathematic"
  },
]

function getCats(books) {
  let ncats = {};
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const bcats = b.Category.split(";").map(b => b.trim())

    for (let j = 0; j < bcats.length; j++) {
      const jbcat = bcats[j];
      ncats[jbcat] = jbcat.split(" ").join("_");
    }
  }

  return ncats;
}

// create categories class
function createCategories(cats) {
  let bcats = '';
  Object.keys(cats).forEach(c => {
    cat = `
    :Cat_${cats[c]}  a  owl:NamedIndividual ;
            :name   "${c}" .
    \n`
    bcats += cat;
  });

  return bcats;
}

function getPubs(books) {
  let pubs = {};
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    pubs[b.Publisher] = b.Publisher.split(" ").join("_");
    console.log('getpubs', pubs[b.Publisher])
  }

  return pubs;
}

function createPubs(pubs) {
  let spubs = '';

  Object.keys(pubs).forEach(el => {
    console.log('createPubs', pubs[el]);
    p = `
    :Pub_${pubs[el]}
            a       :Publisher , owl:NamedIndividual ;
            :name   "${el}" .
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
    console.log(comma, a);
    auths[b.Author] = a.split(" ").join("_");
  }

  return auths;
}

function createAuthor(auths) {
  let sauths = ''
  Object.keys(auths).forEach(el => {
    const a = `
    :Auth_${auths[el]}  a  :Author , owl:NamedIndividual ;
            :name   "${el}" .
    \n`

    sauths += (a);
  });

  return sauths;
}

// console.log('pubs', createAuthor(getAuthor(books)))
// createPubs(getPubs(books)).forEach(c => console.log(c))
// console.log('pubs', getPubs(books));
// console.log('categories', (getCats(books)));


const header = `
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
    :Book_${b.No}  a   :Book , owl:NamedIndividual ;
            :archivedIn   :FMIPA ;
            :kindOf       ${cats} ;
            :name         "${b.Title}" ;
            :publishedBy  :Pub_${bpubs[b.Publisher]} ;
            :writtenBy    :Auth_${bauthor[b.Author]} .
    \n`;
  
    booksOwl += bookOwl

  }

  const owls = header 
    + createCategories(bcats) 
    + createAuthor(bauthor) 
    + createPubs(bpubs) 
    + booksOwl;

  fs.writeFileSync('./output/test.ttl', owls)
}

main();