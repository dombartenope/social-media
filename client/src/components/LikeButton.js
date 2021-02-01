import React, { useEffect, useState } from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const LikeButton = ({user, post: {id, likes, likeCount}}) => {
    const [liked, setLiked] = useState(false);
    const [disableLikeButton, setDisableLikeButton] = useState(false);

    useEffect(()=> {
        if(user){
            setDisableLikeButton(false);
        } else {
            setDisableLikeButton(true);
        }

        if(user && likes.find(like => like.username === user.username)){
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='teal' filled="true">
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        ) 
    ) : (
        <Button color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick = {likePost} disabled={disableLikeButton}>
            {likeButton}
            <Label basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id
                username
            }
            likeCount
        }
    }
`;

export default LikeButton
