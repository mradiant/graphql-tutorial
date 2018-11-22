import React from 'react';
import { Mutation } from 'react-apollo'
import { CHANNELS_LIST } from './ChannelsList'
import gql from "graphql-tag"

const ADD_CHANNEL = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;

const AddChannel = () => (
	<Mutation mutation={ADD_CHANNEL}>
		{(mutate) => (
			<input
				type="text"
				placeholder="New channel"
				onKeyUp={e => {
					if (e.keyCode === 13) {
						e.persist();
						mutate({
							variables: { name: e.target.value },
							optimisticResponse: {
								__typename: "Mutation",
								addChannel: {
									name: e.target.value,
									id: Math.round(Math.random() * -1000000),
									__typename: 'Channel',
								},
							},
							refetchQueries: [{ query: CHANNELS_LIST }],
						}).then(() => {
							e.target.value = '';
						});
					}
				}}
			/>
		)}
	</Mutation>		
);

export default AddChannel;
