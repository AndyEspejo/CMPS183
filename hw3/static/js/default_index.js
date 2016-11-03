// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Following two functions are needed to add new post
    self.newPostButton = function () {
        // Lets us know we are currently writing a post so we can't start writing another post
        self.vue.isAddingPost = !self.vue.isAddingPost

    };
    self.addNewPost = function () {
        // Add a new post
        self.vue.isAddingPost = false;
        $.post(add_post_url,
            {
                post_content: self.vue.post_content
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
            });

    };

    // Following function used to delte post
    self.deletePost = function(postID){
      $.post(del_post_url,
          {
              postID: postID
          },
          function () {
              indx = null;
              for(var i = 0; i < self.vue.posts.length; i++){
                  if(self.vue.posts[i].id === postID){
                      idx = i + 1;
                      break;
                  }
              }
              if(idx){
                  self.vue.posts.splice(idx-1, 1);
              }
          }
      )
    };

    // Following is used to edit post
    self.editPostNotify = function (postID) {
        if(self.vue.isEditing){
            self.vue.isEditing = null;
        }else{
            self.vue.isEditing = postID;
        }

    }

    self.submitEdit = function(postID){
        $.post(edit_post_url,
            {
                postID: postID,
                post_content: self.vue.post_content
            },
            function () {
                indx = null;
                for(var i = 0; i < self.vue.post.length; i++){
                    if(self.vue.post[i].id === postID){
                        idx = i + 1;
                        break;
                    }
                }
                if(idx){
                    self.vue.posts[idx].post_content = post_content;
                }
            }
        )
    }
    // Following two functions are used to display post
    function get_post_url(start_idx, end_idx){

        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return get_posts_url + "?" + $.param(pp);
    }

    self.getPost = function(){
        $.getJSON(get_post_url(0, 4), function (data) {
            self.vue.posts = data.posts;
            self.vue.has_more = data.has_more;
            self.vue.loggedIn = data.loggedIn;

        })
    };
    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            has_more: false,
            loggedIn: false,
            isAddingPost: false,
            isEditing: null,
            posts: [],
            post_content: null,
            user_email: null
        },
        methods: {
            getPost: self.getPost,
            newPostButton: self.newPostButton,
            addNewPost: self.addNewPost,
            deletePost: self.deletePost,
            submitEdit: self.submitEdit,
            editPostNotify: self.editPostNotify
        }

    });
    console.log(self.user_email);
    self.getPost();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
