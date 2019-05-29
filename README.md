# Scrape page to csv & Convert to RDF/TTL
- `scrape.py` can scrape book data from https://lib.unpad.ac.id/index.php?search=Search&keywords=&filterby[node]=Fakultas Matematika dan Ilmu Pengetahuan Alam&filterby[gmd]=Text=1 and save it as CSV file
- `converter.js` can convert the csv to RDF/TTL

The RDF/OWL example can be found in `perpustakaan.owl`

create csv files in `./input/data.csv`
then run `./run.sh`
