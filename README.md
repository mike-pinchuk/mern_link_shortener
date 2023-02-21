# Link shortener

## Description

Full stack app (MERN), with JWT autotization (only access token). User is able to save firt example of link in DB and use it after from link collection.

## Installation

```bash
    $npm i #back-end dependencies
    $npm run client:install #front-end dependencies
```

## Launching app
Before launch app you have to create file(files) in the root: .env.development or/and .env.production 
and fill that according to .env.example 
```bash
    $npm run start:dev #start app for development

    #prepering to deploy
    $npm run client:build
    $npm run start #for start
```
