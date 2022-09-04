# Grebball
Welcome to the GREB football pool webite repository. Flask + React shiny new version

## Overview
The idea is that we are going to run both a Flask (Python) backend and a React (javascript) frontend in one Docker container. As for the database, I would like to keep using a MongoDB instance hosted on MongoDB Atlas.

## Tech Choices
We can list the reasons behind the choices we made technically.

## Frontend Routes Handled

### Session / Auth
* `/`                             => login (landing page)
* `/sessions/goodbye`             => logout current user
* `/auth/:provider/callback`      => OAuth callback (google)
* `/auth/failure`                 => Failed OAuth

-----------------------------------

* `/home`                         => Main page, results and picks for latest week
* `/home/:season/:week`           => Main page, results and picks for given week

* `/picks/:season/:week`          => Show picks for all poolers for a given week
* `/picks/new/:season/:week`      => Create new picks for a given week

## Backend API Routes

* `/pools`                        => List results for the latest week
* `/pools/:season/:week`          => List results for a given week

* `/picks/:season/:week`          => Get info for picks of given week
* `/picks/create/:season/:week`   => Create new picks entry for given week
