#!/bin/sh

if [ $# -ne 1 ]; then
  echo "Please specify 1 argument ($# arguments are given)." 1>&2
  echo "" 1>&2
  echo "USAGE: ./deploy_to_regist_server.sh 1" 1>&2
  echo "(e.g. ./deploy_to_regist_server.sh 1)" 1>&2
  exit 1
fi

ORIGINAL=$(pwd)
CURRENT=$(cd $(dirname $0) && pwd)

cd $CURRENT

mkdir -p ../../public/contests
rm -Rf "../../public/contests/$1"
mkdir -p "../../public/contests/$1"
cp -R "CocosJSGame" "../../public/contests/$1/battle_results"
cp -R "views" "../../public/contests/$1/"

cd $ORIGINAL
