# CONTACTS REST API

Based on Node.js simple REST API for working with the list of contacts, developed within the framework of the GoIT school Node.js studying block.

## Authors

The project was created by me and reviewed by the mentor [Nadya Hristuk](https://github.com/NadyaHristuk).

## API Reference

#### Get all items

```http
  GET/api/contacts
```

#### Add new contact

```http
  POST/api/contacts/
```

| Body field | Type      | Description                         |
| :--------- | :-------- | :---------------------------------- |
| `name`     | `string`  | **Required**. min 3, max 30 symbols |
| `email`    | `string`  | **Required**.                       |
| `number`   | `number`  | **Required**. integer number        |
| `favorite` | `boolean` | **Optional**. false by default      |

#### Get item by ID

```http
  GET/api/contacts/:contactId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Update contact by ID

```http
  PUT/api/contacts/:contactId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

TO UPDATE CONTACT'S INFO AT LEAST ONE OF THE FOLLOWING FIELDS SHOULD BE PROVIDED
| Body field | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `name` | `string` | **Optional**. min 3, max 30 symbols |
| `email` | `string` | **Optional**. |
| `number` | `number` | **Optional**. integer number |
| `favorite` | `boolean` | **Optional**. false by default |

#### Update contact's status by ID

```http
  PATCH/api/contacts/:contactId/favorite
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

TO UPDATE CONTACT'S STATUS THE FOLLOWING FIELD SHOULD BE PROVIDED
| Body field | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `favorite` | `boolean` | **Required**.|

#### Delete contact by ID

```http
  DELETE/api/contacts/:contactId/favorite
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

## Tech Stack

**Back** Node.JS, MongoDB.

**Libs:** Express, Joi, Mongoose, Morgan, Dotenv

## Run Locally

To check it out locally, clone the repository to your machine, open it in CLI (VScode etc) and install it with npm:

```bash
  git clone https://github.com/iuliia-sokol/node-js-hw-02-06
```

Go to the project directory

```bash
  cd  `name of your local folder`
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
npm start - production
npm run start:dev — development
npm run lint — check with eslint
npm lint:fix — check and automatically fix with eslint
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

DB_HOST= /link to your MongoDB database/ - is a must

PORT= /preferable local host port number/ - optional

SECRET_KEY = /randomly generated key, f.e.via https://acte.ltd/utils/randomkeygen/ - is a must

## Acknowledgements

- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [MongoDB Compass](https://www.mongodb.com/try/download/shell)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://www.npmjs.com/package/express)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Joi](https://github.com/hapijs/joi)
- [Postman](https://www.postman.com/)
- [BcryptJs](https://github.com/dcodeIO/bcrypt.js#readme)
