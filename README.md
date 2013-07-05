# *** WORK IN PROGRESS ***
# NullStrap PhoneGap

## A CoffeeScript / PhoneGap bootstrap

### Features / Goals

* One code base for multiple environments (ex. dev, staging, prod apps)
* A single command for pushing environment specific code to github and then building using PhoneGap Build

### Assumptions

* You use CoffeeScript
* You use PhoneGap build, each app pulling from Github

====================

## Technologies

* Bower - http://twitter.github.com/bower/
* Handlebars - http://handlebarsjs.com/
* CoffeeScript - http://coffeescript.org/
* Banshee - http://imulus.github.com/banshee/
* Stylus - http://learnboost.github.io/stylus/

## Dependencies

This command needs to be ran first if CoffeeScript is not installed on your system

* run `sudo npm install -g coffee-script`

## Setup

Install all of the dependencies necessary for the bootstrap

* run `sudo cake system`
* run `cake install`


## Development

The following command will watch and compile Coffeescript, Stylus, and Handlebars files. It also watches server.js for changes.

* run `cake dev`

## Deployment

* run `cake build`
