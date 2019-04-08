const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

require('dotenv').config({ path: 'varaibles.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Bring in graphql express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

//create schema
const schema = makeExecutableSchema({
	typeDefs: typeDefs,
	resolvers: resolvers,
});

const app = express();

//create GraphiQL application

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// connect schemas with GraphQL

app.use(
	'/graphql',
	bodyParser.json(),
	graphqlExpress({
		schema,
		context: {
			Recipe,
			User,
		},
	})
);

console.log(process.env.MONGO_URL);

mongoose
	.connect('mongodb://localhost:27017/recipes')
	.then(() => console.log('DB connected'))
	.catch(err => console.error(err));

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
	console.log(`Server listening on PORT ${PORT}`);
});
