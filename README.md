# TrackerOwls

Use our Owls to track your Assets!

## Overview

Project uses gulp for building production code and spawning dev server with hot reload.
NPM is used for gulp dependencies. Bower is used for 3rd party asset management.
CSS code is written in LESS and managed by gulp. All functionality is written in AngularJS.

## Guidelines

* `AngularJS` (https://github.com/mgechev/angularjs-style-guide)

## Global requirements

* `git` (requirement for bower)
* `node` (at least v4.2.6)
* `npm` (at least v2.14.12)

## Project requirements

* `npm install --global gulp-cli` (at least CLI v1.2.1)
* `npm install --global bower` (at least v1.7.9)

## Setup

* `npm install` (will install all dependencies)

## Running

* `gulp watch` (will install bower dependencies and spawn a dev server on http://localhost:3000/ with hot reload, uses development config)
* `gulp build:dev` (Creates development version of build in `./dist` folder, uses development config)
* `gulp build:prod` (Creates production ready code in `./dist` folder, uses production config)
