<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Table of contents
1. [Project setup](#project-setup)
2. [Compile and run the project](#compile-and-run-the-project)
3. [Run tests](#run-tests)
4. [Request examples](#request-examples)
    1. [Mutations](#mutations)
    2. [Queries](#queries)

## Project setup

* Prepare `.env`:
  * On Unix:
  ```bash
  cp .env.example .env
  ```
  * On Windows:
  ```bash
  copy .env.example .env
  ```

* Install dependencies:
  ```bash
  yarn install
  ```

* Start the Docker containers (`docker-compose.yml`):
  ```bash
  docker compose up -d
  ```

* Migrate the database:
  ```bash
  yarn migrations:run
  ```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Request examples

Pay attention that **you need a JWT** to perform any query or mutation. The email below (`test@gmail.com`) will be an admin upon registration.

### Mutations

<details>

#### Users

<details>

1. `register()`:
```graphql
mutation {
  register(input: {
    email: "test@gmail.com"
    password: "qwerty"
  }) {
    id
    email
    role
  }
}
```
The email must be unique.

2. `login()`:
```graphql
mutation {
  login(input: {
    email: "test@gmail.com"
    password: "qwerty"
  }) {
    accessToken
  }
}
```
Get the JWT from response and add the `Authorization` header as `Bearer token_here`.

3. `makeUserAdmin()`:
```graphql
mutation {
  makeUserAdmin(input: {
    userId: "111da7d6-330d-4eaa-b283-b81e5c00665b"
  }) {
    id
    email
    role
  }
}
```
You cannot make yourself an admin. **You need to be `admin`** to create/update/delete entities.

</details>

#### Authors

<details>

1. `createAuthor()`:
```graphql
mutation {
  createAuthor(input: {
    name: "Test Author 1"
    biography: "Test biography"
  }) {
    id
    name
    biography
  }
}
```
Name must be unique.

2. `updateAuthor()`:
```graphql
mutation {
  updateAuthor(id: "7a63b138-970e-4178-949c-3af099c3aac0", input: {
    name: "Test Author 1 Edited"
    biography: "Test biography edited"
  }) {
    id
    name
    biography 
  }
}
```

3. `deleteAuthor()`:
```graphql
mutation {
  deleteAuthor(id: "7a63b138-970e-4178-949c-3af099c3aac0")
}
```

</details>

#### Books

<details>

1. `createBook()`:
```graphql
mutation {
  createBook(input: {
    authorId: "de7d6b9e-210b-4247-8820-3127ae1e1074"
    title: "Test Book 1"
    publicationDate: "2025-04-24T15:16:50.814Z"
    genre: "Horror"
  }) {
    id
    title
    genre
    publicationDate
    author {
      id
      name
      biography
    }
  }
}
```

2. `updateBook()`:
```graphql
mutation {
  updateBook(id: "fdce3070-93f3-4ae3-befd-0d1886c2d412", input: {
    title: "Test Book 1 Edited"
    genre: "Thriller"
  }) {
    id
    title
    genre
    publicationDate
    author {
      id
      name
      biography
    }
  }
}
```

3. `deleteBook()`:
```graphql
mutation {
  deleteBook(id: "fdce3070-93f3-4ae3-befd-0d1886c2d412")
}
```

</details>

</details>

### Queries

<details>

#### Authors

<details>

1. `author()`:
```graphql
query {
  author(id: "de7d6b9e-210b-4247-8820-3127ae1e1074") {
    id
    name
    biography
    booksCount
  }
}
```

2. `getAuthors()`:
```graphql
query {
  getAuthors(input: {
    booksCount: 1
    name: "Test"
    sortBy: name
    sortOrder: "ASC"
    limit: 10
    page: 1
  }) {
    data {
      id
      name
      biography
      booksCount
    }
    page
    pageSize
    total
    totalPages
  }
}
```

</details>

#### Books

<details>

1. `book()`:
```graphql
query {
  book(id: "a9c0cb45-fe75-4e66-9a57-43af53fd781e") {
    id
    title
    genre
    publicationDate
    author {
      id
      name
      biography
    }
  }
}
```

2. `getBooks()`:
```graphql
query {
  getBooks(input: {
    author: "Test"
    title: "Test"
    publicationYear: 2025
    sortBy: title
    sortOrder: "ASC"
    limit: 10
    page: 1
  }) {
    data {
      id
      title
      genre
      publicationDate
      author {
        id
        name
        biography
      }
    }
    page
    pageSize
    total
    totalPages
  }
}
```

</details>

#### Users

<details>

1. `me()`:
```graphql
query {
  me {
    id
    email
    role
  }
}
```

2. `getUser()`:
```graphql
query {
  getUser(input: {
    id: "7c5ef962-3250-4d36-8aed-163d4b6e57d3"
    email: "test@gmail.com"
  }) {
    id
    email
    role
  }
}
```
By email or by ID.

</details>

</details>

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
