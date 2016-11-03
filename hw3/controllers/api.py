# These are the controllers for your ajax api.


def index():

    pass


def get_posts():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!
    print "Getting Post"
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0

    posts = []
    hasMore = False
    rows = db().select(db.post.ALL, orderby=~db.post.created_on, limitby=(start_idx, end_idx+1))
    for i, r in enumerate(rows):
            if i < end_idx - start_idx:
                t = dict(
                    id=r.id,
                    user_email=r.user_email,
                    created_on=r.created_on,
                    updated_on=r.updated_on,
                    post_content=r.post_content

                )
                posts.append(t)
            else:
                hasMore = True
    loggedIn = auth.user_id is not None
    user_email =auth.user.email if loggedIn else None
    return response.json(dict(
        posts=posts,
        loggedIn=loggedIn,
        hasMore=hasMore,
        user_email=user_email
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    print "adding post"
    p_id = db.post.insert(
        post_content=request.vars.post_content
    )
    p = db.post(p_id)
    return response.json(dict(post=p))


@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    # Implement me!
    db(db.post.id == request.vars.postID).delete()
    return "ok"


@auth.requires_signature()
def edit_post():
    print request.vars.postID
    p = db.post(request.vars.postID)
    p.post_content = request.vars.post_content
    p.update_record()
    return "ok"


