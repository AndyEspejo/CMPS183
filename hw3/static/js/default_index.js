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

    function get_post_url(start_idx, end_idx){

        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return get_posts_url + "?" + $.param(pp);
    }

    self.getPost = function(){
        $.getJSON(get_post_url(0, 3), function (data) {
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
            posts: [],
            post_content: null
        },
        methods: {
            getPost: self.getPost,
            newPostButton: self.newPostButton,
            addNewPost: self.addNewPost
        }

    });

    self.getPost();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
