import React from 'react'
import { Query } from 'react-apollo'
import gql from "graphql-tag"

const channelsListQuery = gql`
   {
     channels {
       id
       name
     }
   }
 `;

const ChannelsList = ({ refetch }) => (
  <Query
    query={channelsListQuery}
    fetchPolicy={refetch ? 'cache-and-network': 'cache-first'}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>{error.message}</p>

      return data.channels.map(ch => <li key={ch.id}>{ch.name}</li>)
    }}
  </Query>
)


export default ChannelsList;