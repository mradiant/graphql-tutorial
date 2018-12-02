import React from 'react'
import { Mutation } from 'react-apollo'
import { CHANNEL_DETAILS } from './ChannelDetails'
import { withRouter } from 'react-router'
import gql from "graphql-tag"

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
    }
  }
`;

const AddMessage = ({ match }) => (
	<Mutation mutation={ADD_MESSAGE}>
		{(mutate) => (
			<div className="messageInput">
				<input
					type="text"
					placeholder="New message"
					onKeyUp={(e) => {
						if (e.keyCode === 13) {
							mutate({
								variables: {
									message: {
										channelId: match.params.channelId,
										text: e.target.value
									}
								},
								optimisticResponse: {
									addMessage: {
										text: e.target.value,
										id: Math.round(Math.random() * -1000000),
										__typename: 'Message',
									},
								},
								update: (store, { data: { addMessage } }) => {
									// Read the data from the cache for this query.
									const data = store.readQuery({
										query: CHANNEL_DETAILS,
										variables: {
											channelId: match.params.channelId,
										}
									})
									if (!data.channel.messages.find((msg) => msg.id === addMessage.id)) {
										// Add our Message from the mutation to the end.
										data.channel.messages.push(addMessage);
									}
									// Write the data back to the cache.
									store.writeQuery({
										query: CHANNEL_DETAILS,
										variables: {
											channelId: match.params.channelId,
										},
										data
									})
								},
							})
							e.target.value = ''
						}
					}}
				/>
			</div>
		)}
	</Mutation>
)

export default withRouter(AddMessage);
