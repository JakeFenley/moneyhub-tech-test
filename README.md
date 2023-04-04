# Tech Test Details

In my tech test you will find that I have updated the `/holdings` endpoint in the `admin` service, as well as adding code in the `investments` service to create csv files with the data received.

In my `/services` dir in `admin` i have created `financial-companies-client` and `investments-client` which are basically abstractions of the external service API requests needed to get the data for the CSV. 

In addition to that you will find `generate-holdings-csv` which handles the logic required for combining the data from both external services and returning the csv string.

The route handler in `admin` `/holdings` uses the data received that `generate-holdings-csv` and sends it off to the `investments` service `/investments/export` endpoint which then creates a csv file and returns a 204 status code.


# Testing

I've used jest here to do unit testing on `generate-holdings-csv` with a set of mocks and fixtures.  

To run the tests: 

```bash
cd admin
jest
```

## 1. How might you make this service more secure?
- For TLS and rate limiting we could have a reverse proxy (HAProxy, nginx, etc..) sitting in front of all of the services, handling all requests with HTTPS. After that point we could terminate TLS to gain a performance boost as long as none of the services are configured to recieve any traffic from anything other than the scope of their local environment. Otherwise if we need HTTPS on the microservices themselves we can generate certificates for each service and configure the express app to use them.
- For Authentication/Authorization we could have a gateway API which receives all incoming requests from the reverse proxy and forwards all authorised requests to the relevant services. We could choose to implement the role based permissions at this layer and fail any requests to `admin` where a user is not an admin level role for example, or simply forward an authorised request and allow the services to handle role based permissions themselves.
- Use `SameSite`, `HttpOnly`, and `Secure` for our long lived auth token cookies.
- Handle CSRF protection logic in the previously mentioned auth gateway. 
- Implement a CORS policy so that only authorised domains can submit requests to our app.

##  2. How would you make this solution scale to millions of records?
- Implement pagination using cursors based on the `date` column.
- Assuming there will be filtering on these endpoints I would index `userId`, `date`, `firstName`, and `lastName`. I would also normalise `holdings` and then index and change `id` to `companyId` to allow for filtering based on companies as well.
- With pagination implemented I would then run `n` queries to get `n` pages, rather than requesting all the data at once. This helps to keep the db from locking up, especially if records trying to be read are locked during an ACID transaction.

##  3. What else would you have liked to improve given more time?
- I would consider if `investments` needs to be creating the CSV here and consider moving that logic into `admin`.
- Rather than saving a CSV file to the file system as I have in `investments`, I would like to use a writestream and send the file in the http response.
- I would add logging across the services and create detailed error classes/messages at all points of failure.
- I would deploy a low level environment for integration and e2e tests using live services.
- In `investments` we have our incoming json payload size limit set to 10mb. 10mb is probably something like 50k records so anything above that will fail. The options would be to either increase the size limit, or use websockets to stream the data from `admin` to `investments` for csv creation.


# Moneyhub Tech Test - Investments and Holdings

At Moneyhub we use microservices to partition and separate the concerns of the codebase. In this exercise we have given you an example `admin` service and some accompanying services to work with. In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature has been received

## Requirements

- An admin is able to generate a csv formatted report showing the values of all user holdings
    - The report should be sent to the `/export` route of the investments service
    - The investments service expects the csv report to be sent as json
    - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
    - The holding should be the name of the holding account given by the financial-companies service
    - The holding value can be calculated by `investmentTotal * investmentPercentage`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages)
- Make effective use of git

We prefer:
- Functional code 
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes
All of you work should take place inside the `admin` microservice

For the purposes of this task we would assume there are sufficient security middleware, permissions access and PII safe protocols, you do not need to add additional security measures as part of this exercise.

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around *1-2 hours* working on it

## Deliverables
**Please make sure to update the readme with**:

- Your new routes
- How to run any additional scripts or tests you may have added
- Relating to the task please add answers to the following questions;
    1. How might you make this service more secure?
    2. How would you make this solution scale to millions of records?
    3. What else would you have liked to improve given more time?
  

On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.

## Getting Started

Please clone this service and push it to your own github (or other) public repository

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

Use Postman or any API tool of you choice to trigger your endpoints (this is how we will test your new route).

### Existing routes
We have provided a series of routes 

Investments - localhost:8081
- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082
- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083
- `/investments/:id` get an investment record by id
