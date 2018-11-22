import React from 'react';
import MessageList from './MessageList';
import ChannelPreview from './ChannelPreview';
import NotFound from './NotFound';
import { Query } from 'react-apollo'
import gql from "graphql-tag"

export const CHANNEL_DETAILS = gql`
	query ChannelDetailsQuery($channelId : ID!) {
    channel(id: $channelId) {
      id
      name
      messages {
        id
        text
      }
    }
  }
`;

const ChannelDetails = ({ match }) => (
	<Query query={CHANNEL_DETAILS} variables={{ channelId: +match.params.channelId }}>
		{({ data: { loading, error, channel } }) => {
			if (loading) return <ChannelPreview channelId={match.params.channelId} />
			if (error) return <p>{error.message}</p>
			if (!channel) return <NotFound />

			return (
				<div>
					<div className="channelName">
						{channel.name}
					</div>
					<MessageList messages={channel.messages}/>
				</div>
			)
		}}				
	</Query>    
);


export default (ChannelDetails);
