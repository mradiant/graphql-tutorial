import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { graphiqlExpress } from 'graphql-server-express';
import cors from 'cors'
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'

const PORT = 4000

const server = new ApolloServer({ typeDefs, resolvers })

const app = express()

server.applyMiddleware({ app })

app.use('*', cors({
	origin: 'http://localhost:3000',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	optionsSuccessStatus: 200,
}))

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql'
}));

app.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
