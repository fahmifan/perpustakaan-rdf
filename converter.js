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
    "Publisher": "john wiley & sons : new york ,., 1988",
    "Category": "mathematic; engineering; database management"
  },
  {
    "No": 2,
    "Title": "mathematics for the technologies with calculus",
    "Author": "clar,lawrence m",
    "Library": "fakultas matematika dan ilmu pengetahuan alam",
    "Publisher": "prentice hall : amerika 1978",
    "Category": "calculus; mathematic"
  },
  {
    "No": 3,
    "Title": "discrete mathematics with combinatoric",
    "Author": "anderson,james a",
    "Library": "fakultas matematika dan ilmu pengetahuan alam",
    "Publisher": "prentice hall : new jersey., 2001",
    "Category": "discrete; mathematic"
  },
]

function getCats(cats) {
  let ncats = {};
  for (let i = 0; i < cats.length; i++) {
    const b = cats[i];
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

console.log('categories', createCategories(books));

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
