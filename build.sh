#!/bin/bash

echo "Browserifying..."
npx browserify ./es6/index.js -s isEq > ./es5/infinity.temp.js
echo "Babelifying..."
npx babel ./es5/infinity.temp.js --presets=env -o ./es5/infinity.js
echo "Minifying output..."
npx uglifyjs ./es5/infinity.js > ./es5/infinity.min.js
echo "Cleaning up..."
rm ./es5/infinity.temp.js
echo "Done!"