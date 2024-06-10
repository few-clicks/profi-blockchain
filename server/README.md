# Golang Server with CouchDB Integration

## Overview

This documentation provides a detailed guide on setting up and running a Golang server that interacts with a CouchDB database. The server supports creating, reading, and deleting documents in CouchDB. It uses the Kivik library for CouchDB interactions and Gorilla Mux for routing.

## Table of Contents

1. Introduction
2. Setup and Installation
3. Environment Configuration
4. Server Endpoints
   - /create
   - /read
   - /
   - /{id}
5. Database Initialization
6. Running the Server
7. Error Handling
8. Example Requests

## 1. Introduction

This Golang server provides a RESTful API for interacting with a CouchDB database. It supports creating, reading, and deleting documents. The server uses the Kivik library for CouchDB interactions and Gorilla Mux for routing.

## 2. Setup and Installation

### Prerequisites

- Golang (v1.16 or higher)
- CouchDB (v3.0 or higher)

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install the required dependencies:

go get -u github.com/go-kivik/kivik/v3
go get -u github.com/go-kivik/couchdb/v3
go get -u github.com/joho/godotenv
go get -u github.com/gorilla/mux

## 3. Environment Configuration

Create a .env file in the root directory and specify the CouchDB URL:

```
COUCHDB_URL=http://admin:password@localhost:5984/
```

## 4. Server Endpoints

### /create

#### Description

Creates a new document in the CouchDB database.

#### Method

POST

#### Response

```
{
  "message": "Document created with revision: <revision_id>"
}
```

### /read

#### Description

Reads a document from the CouchDB database.

#### Method

GET

#### Response

```
{
  "_id": "example_doc",
  "_rev": "1-xyz",
  "type": "example",
  "name": "Golang CouchDB"
}
```

### /

#### Description

Gets all items from the CouchDB database.

#### Method

GET

#### Response

```
[
  {
    "_id": "item1",
    "_rev": "1-xyz",
    "title": "Item 1",
    "description": "Description for Item 1"
  },
  ...
]
```

### /{id}

#### Description

Gets or deletes an item by ID from the CouchDB database.

#### Method

GET, DELETE

#### Response

- GET:

```
{
  "_id": "item1",
  "_rev": "1-xyz",
  "title": "Item 1",
  "description": "Description for Item 1"
}
```

- DELETE:

```
{
  "message": "Document deleted"
}
```

## 5. Database Initialization

The database is initialized in the initDb function. It connects to CouchDB, creates or opens the specified database, and sets up the client and database variables.

```
func initDb() {
  var err error
  client, err = kivik.New("couch", "http://admin:password@localhost:5984/")
  if err != nil {
    log.Fatalf("Failed to connect to CouchDB: %s", err)
  }

  err = client.CreateDB(context.TODO(), dbName)
  if err != nil && err.Error() != "Precondition Failed: The database could not be created, the file already exists." {
    log.Fatalf("Failed to create database: %s", err)
  }

  db = client.DB(context.TODO(), dbName)
  if err != nil {
    log.Fatalf("Failed to open database: %s", err)
  }
}
```

## 6. Running the Server

To run the server, use the following command:

```
go run main.go
```

The server will start and listen on port 8000.

### Example Output

Server is running on port 8000

## 7. Error Handling

The server includes error handling to manage issues that may arise during database interactions. If an error occurs, the server logs the error and returns an appropriate HTTP status code with an error message.

### Example

```
if err != nil {
  http.Error(w, err.Error(), http.StatusInternalServerError)
  return
}
```

## 8. Example Requests

### Create Document

```
curl -X POST http://localhost:8080/create
```

### Read Document

```
curl -X GET http://localhost:8080/read
```

### Get All Items

```
curl -X GET http://localhost:8000/
```

### Get Item by ID

```
curl -X GET http://localhost:8000/{id}
```

### Delete Item by ID

```
curl -X DELETE http://localhost:8000/{id}
```
