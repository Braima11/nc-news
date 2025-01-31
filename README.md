# NC News API

## Description

The **NC News API** is a backend service designed to provide programmatic access to application data, mimicking the functionality of a real-world platform like Reddit. This API allows users to interact with a PostgreSQL database using Node.js and the `node-postgres` library. It supports various endpoints to retrieve, add, update, and delete data related to topics, articles, comments, and users.

This project is built with a focus on RESTful principles, ensuring a clean and intuitive interface for front-end applications to consume.

Live API: https://news-journal.onrender.com/

---

## Key Features

- **Topics**: Retrieve a list of available topics.
- **Articles**: Fetch a list of articles, filter and sort them, or retrieve a single article by its ID.
- **Comments**: Fetch comments for a specific article, add new comments, or delete existing ones.
- **Users**: Retrieve a list of users.
- **Endpoints**: Explore all available API endpoints.

---

## API Documentation

## API Endpoints

| **Endpoint**                         | **Method** | **Description**                                                   |
| ------------------------------------ | ---------- | ----------------------------------------------------------------- |
| `/api/topics`                        | GET        | Retrieve a list of all topics.                                    |
| `/api`                               | GET        | List all available endpoints.                                     |
| `/api/articles/:article_id`          | GET        | Retrieve a single article by its ID, including a comment count.   |
| `/api/articles`                      | GET        | Retrieve a list of articles, with optional filtering and sorting. |
| `/api/articles/:article_id/comments` | GET        | Retrieve all comments for a specific article.                     |
| `/api/articles/:article_id/comments` | POST       | Add a new comment to a specific article.                          |
| `/api/articles/:article_id`          | PATCH      | Update an article's vote count by its ID.                         |
| `/api/comments/:comment_id`          | DELETE     | Delete a comment by its ID.                                       |
| `/api/users`                         | GET        | Retrieve a list of all users.                                     |

## Access the API documentation at /api for a full list of available endpoints and their usage.

## Installation Instructions

First, ensure you have the minimum required versions:

- Node.js v18.19.1
- PostgreSQL v14.0

## Clone and set up the repository:

git clone https://github.com/Braima11/nc-news.git

## Install dependencies

npm install

Set up your environment files in the root directory:

.env.development:
PGDATABASE=nc_news

.env.test:
PGDATABASE=nc_news_test

Initialize the database:

npm run setup-dbs
npm run seed

## Usage Information

Start the server:

npm start

## Testing Instructions

Run the test suite:

npm test

The tests cover:

Endpoint functionality
Error handling

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
