import React, { Component } from 'react'
import MessageList from './MessageList'
import ChannelPreview from './ChannelPreview'
import NotFound from './NotFound'
import { Query } from 'react-apollo'
import gql from "graphql-tag"

export const CHANNEL_DETAILS = gql`
	query ChannelDetailsQuery($channelId: ID!, $cursor: String) {
    channel(id: $channelId) {
      id
      name
      messageFeed(cursor: $cursor) @connection(key: "messageFeed") {
        cursor
        messages {
          id
          text
        }
      }
		}
	}	
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      text
    }
  }
`

class ChannelDetails extends Component {
	componentDidMount() {
		this.props.subscribeToNewMessages();
	}

	render() {
		const { loading, error, data: { channel }, channelId, loadOlderMessages } = this.props

		if (loading) return <ChannelPreview channelId={channelId} />
		if (error) return <p>{error.message}</p>
		if (channel === null) return <NotFound />

		return (
			<div>
				<button onClick={loadOlderMessages}>
					Load Older Messages
        </button>
				<div className="channelName">{channel.name}</div>
				<MessageList messages={channel.messageFeed.messages} />
			</div>
		)
	}
}


export default ({ match: { params: { channelId } } }) => (
	<Query query={CHANNEL_DETAILS} variables={{ channelId }}>
		{({ subscribeToMore, fetchMore, ...result }) => {
			return (
				<ChannelDetails
					{...result}
					channelId={channelId}
					subscribeToNewMessages={() => {
						subscribeToMore({
							document: MESSAGES_SUBSCRIPTION,
							variables: { channelId },
							updateQuery: (prev, { subscriptionData }) => {
								if (!subscriptionData.data) {
									return prev;
								}
								const newMessage = subscriptionData.data.messageAdded;
								if (!prev.channel.messages.find((msg) => msg.id === newMessage.id)) {
									return Object.assign({}, prev, {
										channel: Object.assign({}, prev.channel, {
											messages: [...prev.channel.messages, newMessage],
										})
									});
								} else {
									return prev;
								}
							}
						})
					}}
					loadOlderMessages={() => {
						fetchMore({
							variables: {
								channelId: result.data.channel.id,
								cursor: result.data.channel.messageFeed.cursor,
							},
							updateQuery: (previousResult, { fetchMoreResult }) => {
								const prevMessageFeed = previousResult.channel.messageFeed;
								const newMessageFeed = fetchMoreResult.channel.messageFeed;
								const newChannelData = {
									...previousResult.channel,
									messageFeed: {
										...previousResult.channel.messageFeed,
										messages: [
											...newMessageFeed.messages,
											...prevMessageFeed.messages
										],
										cursor: newMessageFeed.cursor
									}
								}
								const newData = {
									...previousResult,
									channel: newChannelData
								};
								return newData;
							}
						})
					}}
				/>
			)
		}}
	</Query>
)
