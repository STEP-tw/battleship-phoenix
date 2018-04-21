#!/usr/bin/env bash

apt-get update
sudo apt-get install -y npm
sudo apt-get install -y vim

sudo apt-get install -y git
sudo apt-get install -y curl

curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install -g mocha
npm install -g nyc
npm install -g nodemon
npm install -g eslint
