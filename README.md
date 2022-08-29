# Grebball
Welcome to the GREB football pool webite repository. Flask + React shiny new version

## Overview
The idea is that we are going to run both a Flask (Python) backend and a React (javascript) frontend in one Docker container. As for the database, I would like to keep using a MongoDB instance hosted on MongoDB Atlas.

## Tech choices
We can list the reasons behind the choices we made technically.

## Routes handled

### Session / Auth
* '/'                           => login (landing page)
* '/sessions/goodbye'           => logout current user
* '/auth/:provider/callback'    => OAuth callback (google)
* '/auth/failure'               => Failed OAuth

### Client Routes

#### Pools
* '/pools/index'                => Main page, after login

#### Poolers
* '/poolers/show'               => Return current pooler info
* '/poolers/new'                => Create new pooler
* '/poolers/update'             => Failed OAuth

#### Picks
* '/picks/show/:id'             => Return picks info
* '/picks/search/:season/:week' => Search for picks
* '/picks/new/:season/:week'    => Create new picks