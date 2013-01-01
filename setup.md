---
layout: dinky
menu_title: Setup
order: 2
---

# Setting up your environment

Install [node.js][node] and [MongoDB][mongo] (use your favorite package manager or follow the
instructions on their site). The example code was tested with versions 0.8.16 and 2.2.2.

Clone the project:

    git clone https://github.com/olim7t/map-tutorial.git

Go into the newly created directory and install the project's dependencies:

    cd map-tutorial
    npm install

Start the web server:

    node app.js

Browse to [http://localhost:3000](http://localhost:3000), you should see the main page
(not very functional at this stage).

Start MongoDB, and try a few commands to make sure everything works:

    mongod
    mongo
    use test
    db.foobar.insert({});
    show collections

Next: [Feature 1: Map display](display.html)

[node]: http://nodejs.org/
[mongo]: http://www.mongodb.org/