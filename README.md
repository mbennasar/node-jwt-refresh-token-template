# node-jwt-refresh-token-template
Template to implement access and refresh token authentication using NodeJS and JWT

## Installation

Install dependencies using **npm install** and then run the code using **node app.js**.

## Testing

- To test if the server works, make a GET call at http://localhost:3000/api/ (the default port is 3000)
- To test if the auth works, make a POST call at http://localhost:3000/api/login with the following data

```
{
	"email": "shahid@codeforgeek.com",
	"name": "Shahid"
}
```

- To test secured areas, make a GET call to http://localhost:3000/api/secure and make sure to provide the **custom header** below in headers.

```x-access-token=access token from the previous API```
