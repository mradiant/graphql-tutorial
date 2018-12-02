import React from 'react'
import { Query } from 'react-apollo' 
import gql from 'graphql-tag'

export const CHANNEL = gql`
  query ChannelQuery($channelId : ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;

const ChannelPreview = ({ channelId }) => (
	<Query query={CHANNEL} variables={{ channelId }}>
		{({ data: { channel } }) => (
			<div>
				<div className="channelName">
					{channel ? channel.name : 'Loading...'}
				</div>
				<div>Loading Messages</div>
			</div>
		)}
	</Query>
)

export default ChannelPreview;
