#!/usr/bin/env bash
DIR="$(sudo dirname "$(readlink -f "$0")")"
cd "$DIR"
cd ..

echo
echo
echo checking screen...
if dpkg-query -l screen; then
    echo screen already installed
else
    echo trying install screen...
    sudo apt-get update
    sudo apt-get install screen
fi

echo
echo
echo checking nvm version...
. ~/.nvm/nvm.sh
nvm install 7.1.0
nvm alias default node

echo
echo
echo checking npm version...
if ! npm outdated -g npm | grep -z npm; then
    echo npm is up to date
else
    echo trying to update npm...
    npm install -g npm
fi