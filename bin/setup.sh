npm install
npm install -g mocha
npm install -g nyc
npm install -g nodemon
npm install -g eslint
apm install

mkdir log
touch log/request.log
git config --local commit.template .github/commit.txt
cp .github/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
