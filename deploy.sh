#!/bin/bash
yarn build
gcloud config set account thomvaladez@gmail.com
gcloud config set project th-m-val
gcloud app deploy --quiet