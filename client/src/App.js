import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from "apollo-boost";
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import ChannelsList from './ChannelsList';
import logo from './logo.svg';
import './App.css';
import { typeDefs } from './schema';

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema });

const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

const client = new ApolloClient({
  networkInterface: mockNetworkInterface,
});

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to Apollo</h2>
          </div>
          <ChannelsList />
        </div>
      </ApolloProvider>
    );
  }
}
