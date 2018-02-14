eslint .
if [ $? == 1 ]; then
  exit 1
fi
nyc mocha --recursive
if [ $? == 1 ]; then
  exit 1
fi
nyc check-coverage
