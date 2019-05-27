echo ">>> generate csv"
./node_modules/csvtojson/bin ./input/data.csv > ./input/data.js

echo ">>> generate turtle file"
./converter.js

echo ">>> finished"