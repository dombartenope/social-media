import React, { useState } from 'react';
import { Button, Confirm, Icon } from 'semantic-ui-react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const DeleteButton = ({ postId, callback }) => {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST_MUTATION,{
        update(proxy){
            setConfirmOpen(false);
            
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });

            data.getPosts = data.getPosts.filter(p => p.id !== postId);
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data}})

            if(callback) callback();
        },
        variables: {
            postId
        }
    });

    return (
        <>
            <Button 
                floated="right"  
                as="div" 
                color="red" 
                onClick={() => setConfirmOpen(true)}
            >
                <Icon 
                    name="trash" 
                    style={{margin: 0}}
                />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    )
};

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

export default DeleteButton;
