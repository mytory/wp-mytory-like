const axios = require('axios');

new Vue({
    el: '.js-like-button',
    data: {
        postId: parseInt(document.querySelector('.js-like-button').dataset.postId),
        alreadyLiked: false,
        likeCount: parseInt(document.querySelector('.js-like-button').dataset.likeCount)
    },
    methods: {
        toggle() {
            let liked = [];
            if (localStorage.getItem('liked')) {
                liked = JSON.parse(localStorage.getItem('liked'));
            }

            if (this.alreadyLiked) {
                // 좋아요 취소
                liked = liked.filter(item => this.postId !== item);
                this.alreadyLiked = false;
                this.likeCount -= 1;
                this.changeLikeCount(this.postId, -1);
            } else {
                // 좋아요
                liked.push(this.postId);
                this.alreadyLiked = true;
                this.likeCount += 1;
                this.changeLikeCount(this.postId, +1);
            }
            localStorage.setItem('liked', JSON.stringify(liked));
        },
        changeLikeCount(postId, likeCount) {
            axios({
               url: window.mytory_like.ajax_url,
               method: 'post',
               params: {
                   action: 'change_like_count',
                   ID: postId,
                   like_count: likeCount
               }
            })
                .then(res => {
                    if (res.data.result === 'success') {
                        this.likeCount = res.data.likeCount;
                    } else {
                        throw res.data.message;
                    }
                })
                .catch(error => {
                    alert(error);
                });
        }
    },
    mounted() {
        if (!localStorage.getItem('liked')) {
            this.alreadyLiked = false;
        } else {
            let liked = JSON.parse(localStorage.getItem('liked'));
            this.alreadyLiked = (liked.indexOf(this.postId) > -1);
        }
    }

});