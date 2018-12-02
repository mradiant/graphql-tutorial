import React, { Component } from 'react'
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { BrowserRouter, Link, Route, Switch,} from 'react-router-dom'
import ChannelsList from './components/ChannelsList'
import ChannelDetails from './components/ChannelDetails'
import NotFound from './components/NotFound'
import './App.css'

const httpLink = new HttpLink({
	uri: 'http://localhost:4000/graphql'
});

const wsLink = new WebSocketLink({
	uri: `ws://localhost:4000/graphql`,
	options: {
		reconnect: true
	}
});

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpLink,
);

function dataIdFromObject(result) {
	if (result.__typename) {
		if (result.id !== undefined) {
			return `${result.__typename}:${result.id}`
		}
	}
	return null;
}

const cache = new InMemoryCache({
	cacheRedirects: {
		Query: {
			channel: (_, args, { getCacheKey }) => {
				return getCacheKey({ __typename: 'Channel', id: args['id'] })
			},
		},
	},
	dataIdFromObject,
})

const client = new ApolloClient({	link,	cache });

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
				<BrowserRouter>
					<div className="App">
						<Link to="/" className="navbar">React + GraphQL Tutorial</Link>
						<Switch>
							<Route exact path="/" component={ChannelsList} />
							<Route path="/channel/:channelId" component={ChannelDetails} />
							<Route component={NotFound} />
						</Switch>
					</div>
				</BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App
