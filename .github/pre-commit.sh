eslint .
if [ $? == 1 ]; then
  exit 1
fi
nyc mocha
if [ $? == 1 ]; then
  exit 1
fi
nyc check-coverage
