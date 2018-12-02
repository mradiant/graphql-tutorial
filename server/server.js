import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { graphiqlExpress } from 'graphql-server-express'
import cors from 'cors'
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'

const PORT = 4000

const app = express()

app.use('*', cors({
	origin: `http://localhost:3000`,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	optionsSuccessStatus: 200,
}))

const httpServer = createServer(app)

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app })
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})
