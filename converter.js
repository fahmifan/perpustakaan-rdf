#!/usr/bin/env node

const book = {
  "No": 1,
  "Title": "advanced engineering mathematics",
  "Author": "kreyszig, erwin",
  "Library": "fakultas matematika dan ilmu pengetahuan alam",
  "Publisher": "john wiley & sons",
  "Category": "mathematic; engineering"
}

const books = [
  {
    "No": 1,
    "Title": "advanced engineering mathematics",
    "Author": "kreyszig, erwin",
    "Library": "fakultas matematika dan ilmu pengetahuan alam",
    "Publisher": "john wiley & sons",
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
      ncats[jbcat] = jbcat;
    }
  }

  return ncats;
}

// create categories class
function createCategories(books) {
  const bcats = getCats(books);
  const cats = []
  Object.keys(bcats).forEach(b => {
    cat = `:Cat_${b.split(' ').join('_')}  a  owl:NamedIndividual ;
            :name   "${b}" .
    `
    cats.push(cat);
  });

  return cats;
}

function getPubs(books) {
  let pubs = {};
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const bcats = b.Publisher.split(" ").join("_")
    pubs[bcats] = bcats;
  }

  return pubs;
}

function createPubs(pubs) {
  const cats = []
  Object.keys(pubs).forEach(el => {
    cat = `:Pub_${el}
    a       :Publisher , owl:NamedIndividual ;
    :name   "${el}" .
    `

    cats.push(cat);
  });

  return cats;
}

function getAuthor(auth) {
  let auths = {};
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const bauth = b.Author.split(" ").join("_")
    auths[bauth] = bauth;
  }

  return auths;
}

function createAuthor(auths) {
  const nauths = []
  Object.keys(auths).forEach(el => {
    cat = `:Author  a               owl:Class ;
    rdfs:subClassOf  :Person .
    `

    nauths.push(cat);
  });

  return nauths;
}

// console.log('pubs', createAuthor(getAuthor(books)))
// createPubs(getPubs(books)).forEach(c => console.log(c))
// console.log('pubs', getPubs(books));
// console.log('categories', createCategories(books));

return;

let cats = "";
const bookCats = book.Category.split(";");
bookCats.forEach((c, i) => {
  // last item
  if (i === bookCats.length - 1) {
    cats += `Cat_${c}`;
  } else {
    cats += `Cat_${c}, `;
  }
});

const bookOwl = `
:Book_${book.No}  a   :Book , owl:NamedIndividual ;
        :archivedIn   :FMIPA ;
        :kindOf       :${cats} ;
        :name         "${book.Title}" ;
        :publishedBy  :Pub_${book.Publisher} ;
        :writtenBy    :Auth_${book.Author} .
`;

console.log(bookOwl);
