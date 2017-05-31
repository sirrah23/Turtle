#!/bin/bash

docker run -v $(pwd):/app -p 8080:3000 -d -t turtle /bin/bash -c "npm install;node app.js"
