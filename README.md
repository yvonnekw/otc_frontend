# Frontend

This is the otc-frontend repo, for the otc-backend repo, located in here -

https://github.com/yvonnekw/otc_backend

You will need to clone the backend as well as this frontend repo in order to run the app
locally.

### Install and Compile

Clone the otc-backend and follow the readme file into setting everything up.

https://github.com/yvonnekw/otc_backend.git

Clone the otc-frontend -

https://github.com/yvonnekw/otc_frontend.git

Run these commands to install and view the frontend pages:

`cd otc-frontend`

`npm install`

Utilise the website as:

`npm run dev`

Proceed to visit the website at 'http://localhost:2000' if everything is in order.

### Build the frontend application in preparation for deployment

You must use the following command to build the frontend.

`npm run build`

All the files will be compiled into the dist folder as a result. This is what Docker will utilise to build the image for the docker compose.

For information on how to deploy the application, see the README.md file in the backend directory.

## Run tests locally
The following commnan will execute all the tests
`npm run test`

### Filter a test to run
To run for example the test for NavBarTest.ts, filter it out this way and execute the following command -
`npm run test NavBar`
https://github.com/yvonnekw/otc_backend
