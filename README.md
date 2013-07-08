DIP
===

### No-ip style Dynamic IP client/server setup

Server provides REST endpoints to update a mongo database

Clients is installed on remote systems and configured to 'phone home' when their ip address changes. 

## Requirements

* [node.js](http://nodejs.org/)
* [mongodb](http://www.mongodb.org/downloads/) 
* [forever](https://github.com/nodejitsu/forever)


## Usage

#### Launch the Server:

On Server: 

    git clone https://github.com/samartioli/DIP.git
    cd DIP/server
    npm install
    forever start app.js

#### Install the Clients:

On Clients:

    git clone https://github.com/samartioli/DIP.git
    cd DIP/client
    npm install
    forever start app.js -n [client_name] -s [server_hostname]


## NOTES: 

To View forever processes use:

    forever list