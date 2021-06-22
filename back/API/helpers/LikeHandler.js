export default (sauce, like, userId) => {
    let usersLiked    = sauce.usersLiked.filter(userID => userID != userId);
    let usersDisliked = sauce.usersDisliked.filter(userID => userID != userId);

    if(like == 1)  usersLiked.push(userId);
    if(like == -1) usersDisliked.push(userId);

    return {
        likes : usersLiked.length,
        dislikes : usersDisliked.length,
        usersLiked : usersLiked, 
        usersDisliked : usersDisliked
    }   
}