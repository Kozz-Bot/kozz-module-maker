#!/usr/bin/env sh

folder_path="./keys"

if [ ! -d "$folder_path" ]; then
  mkdir -p "$folder_path"
fi

openssl genrsa -out ../keys/privatekey.pem 2048
openssl rsa -in ../keys/privatekey.pem -out ../keys/publickey.pem -pubout -outform PEM
