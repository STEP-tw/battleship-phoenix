mocha --recursive
if [ $? == 1 ]; then
  exit 1
fi
git remote rm heroku
heroku create
git push heroku master
heroku open
