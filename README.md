# Task Management

This is a simple task management application built with [NX Monorepo](https://nx.dev/) tool. It was built based on specific requirements provided.

## Overview

The workspace has the following applications and libraries:

`apps/api` is the backend app. It's a [Nest.js](https://nestjs.com/) application provides an API for the frontend app.

`apps/dashboard` is the frontend app. It's a [Angular](https://angular.dev/) application.

`libs/auth` is a helper [Nest.js](https://nestjs.com/) module for authentication and role-based authorization.

`libs/common` is a Javascript library provides a helper functions to be used in the workspace apps.

## How it was built?

1. **Backend**

    Building the backend started with database models design. Based on the requirements, the application needs the following entities:

    - `Organization` represents the `organizations` that users can belong to. Each organization has many users, but each user can belong to one organization.
    - `User` represents the `users` database table. Every user should belong to an organization and has one or more roles.
    - `Role` the user roles. The role connects with `users` table with a many-to-many relation using the `user_roles` pivot table.
    - `Task` it has the tasks information. Each task belongs to one organization and one user.
  
    The following ERD design clarifies how the database tables are connected together and the columns in each table.


    ![ERD](/docs/erd.png)


    The `api` app provides a RESTful API to manage the tasks with some helper endpoints. It uses a basic authentication way that needs to provide a `x-user-id` with a value of the user id in the request header. This is similar to JWT authentication and could be replaced with it.

    The API has an HTTP interceptor to read the request header `x-user-id`, finds the user in the database by the provided id and then attach the user object in the request to be accessible during the request lifecycle.

    The authorization in this app works based on the user role. Currently we have 3 roles: `Owner`, `Admin` and `Viewer`. The Owner and Admin can view,edit and delete the tasks withing the same organization. The Viewer can list tasks in the same organization only.

    The API has a Swagger APi documentation that can be accessed at `/api-docs` endpoint. The Swagger doc has details on every API endpoint and the request headers and responses.

    In the API app, we can run the DB migrations and running seeders. The `SeederModule` seeds some users, organizations, roles and tasks for demo purposes.


2. **Frontend**

    The frontend app is an Angular application that has 3 basic endpoints to access the dashboard, task list and task form.

    It uses Angular Material and Tailwind for styling.

## Installation

To setup the application on local environment, please make sure you have [Docker](https://docs.docker.com/get-started/get-docker/) and [NX CLI](https://nx.dev/getting-started) installed and follow these steps:

1. Clone the repoistory.

    ```
    git clone git@github.com:ma8h7er/turbovets.git
    ```

2. Change the directory to enter the workspace root folder: `cd turbovets`
3. Install dependencies by ruuning `npm install`
4. Copy the API environment file from the example provided by running 
    ```
    cp apps/api/.env.example apps/api/.env
    ```
5. Running the docker containers for Postgres and Adminer by running 

    ```
    docker compose -f apps/api/docker-compose.yaml up -d
    ```
    This will run 2 containers, one for Postgres engine and the second is for Adminer which makes it easy to see the database tables, edit them or change the schema. You can access it at `http://localhost:8080/`. It uses the same DATABASE config in the `apps/api/.env` file.
6. When the docker containers are running, you can seed the data for the demo by running `nx seed:run api`   
7. Start the API server by running `nx serve api`.
8. Start the frontend app by opening a new Terminal window and running `nx serve dashboard`.
9. Access the app at `http://localhost/4200`
10. You can access the API docs at `http://localhost:3000/api-docs`

## Future Improvements

This application is a basic representation of a CRUD app using node.js as a backend API and Angular as a frontend UI. Although, it can be improved by adding several feature like:

1. Build a secure authentication using JWT. In the backend we can generate a JWT token for each user after singing-in with limited TTL (time to live), and generate a refresh token that can be used by the frontend app when the main JWT token is expired so the token will be refreshed and a new token will be sent to the user. The token will be used by the frontend app to communicate with the backend by sending the token in the `Authorization` request header like:

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
    ```

2. In addition for a secure production-ready application, we can make the roles more dynamic. Currently the app uses the role name as identifier to decide the permission the user have, but that can be improved by adding a new `permissions` database table and each role will have many permissions. That makes it more dynamic and we can add as many roles as we want without limiting it to the role name. Also, we can create a page for adding, editing and attaching permissions to the role.

3. The backend app can be more scallable and restructure it to microservices architecture. In this way we can build different services for api-gateway, authentication, task management and more to serve more users and make the development process more flexible if we have many dev teams so each team can focus on one service at a time.

4. The frontend can be improved by designing modern user interfaces and build reusable Angular components. We can add sign-up and sign-in page for authentication.