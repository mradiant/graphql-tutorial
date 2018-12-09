import { gql } from 'apollo-server'

const typeDefs = gql`
type MessageFeed {
  cursor: String!
  messages: [Message]!
}

type Channel {
  id: ID!
  name: String
	messages: [Message]!
	messageFeed(cursor: String): MessageFeed 
}

type Message {
  id: ID!
	text: String
	createdAt: Int
}

input MessageInput{
  channelId: ID!
  text: String
}

type Query {
  channels: [Channel]
  channel(id: ID!): Channel
}

type Mutation {
	addChannel(name: String!): Channel
	addMessage(message: MessageInput!): Message
}

type Subscription {
  messageAdded(channelId: ID!): Message
}
`

export default typeDefs
