import React, { Component } from 'react'
import MessageList from './MessageList'
import ChannelPreview from './ChannelPreview'
import NotFound from './NotFound'
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
		this.props.subscribeToNewMessage();
	}

	render() {
		const { loading, error, data: { channel }, channelId } = this.props

		if (loading) return <ChannelPreview channelId={channelId} />
		if (error) return <p>{error.message}</p>
		if (channel === null) return <NotFound />

		return (
			<div>
				<div className="channelName">{channel.name}</div>
				<MessageList messages={channel.messages} />
			</div>
		)
	}
}


export default ({ match: { params: { channelId } } }) => (
	<Query query={CHANNEL_DETAILS} variables={{ channelId }}>
		{({ subscribeToMore, ...result }) => {
			return (
				<ChannelDetails
					{...result}
					channelId={channelId}
					subscribeToNewMessage={() =>
						subscribeToMore({
							document: MESSAGES_SUBSCRIPTION,
							variables: { channelId },
							updateQuery: (prev, { subscriptionData }) => {
								if (!subscriptionData.data) {
									return prev;
								}
								const newMessage = subscriptionData.data.messageAdded;
								console.log(subscriptionData.data)
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
					}
				/>
			)
		}}
	</Query>
)
