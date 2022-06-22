const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

require('dotenv').config();

const app = express();
const PORT = process.env.EXPRESS_PORT;

app.use(bodyParser.json());

app.use(isAuth);

app.use('/api', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
})
);

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });
