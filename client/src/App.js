import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
	BrowserRouter,
	Link,
	Route,
	Switch,
} from 'react-router-dom';
import ApolloClient from "apollo-boost"
import ChannelsList from './components/ChannelsList'
import ChannelDetails from './components/ChannelDetails';
import NotFound from './components/NotFound';
import './App.css'

function dataIdFromObject(result) {
	if (result.__typename) {
		if (result.id !== undefined) {
			return `${result.__typename}:${result.id}`;
		}
	}
	return null;
}

const cache = new InMemoryCache({
	cacheRedirects: {
		Query: {
			channel: (_, args, { getCacheKey  }) => {
				return getCacheKey({ __typename: 'Channel', id: args['id'] })
			},
		},
	},
	dataIdFromObject,
})

const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache,
});

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
