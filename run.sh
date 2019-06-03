echo ">>> generate data.json from data.csv"
node_modules/csvtojson/bin/csvtojson ./input/data.csv > ./input/data.json

echo ">>> generate turtle file"
./converter.js

echo ">>> finished"