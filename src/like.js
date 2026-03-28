const axios = require('axios');

new Vue({
    el: '.js-like-button',
    data: {
        postId: parseInt(document.querySelector('.js-like-button').dataset.postId),
        nonce: document.querySelector('.js-like-button').dataset.nonce,
        alreadyLiked: false,
        likeCount: parseInt(document.querySelector('.js-like-button').dataset.likeCount)
    },
    methods: {
        toggle() {
            let liked = [];
            if (localStorage.getItem('liked')) {
                liked = JSON.parse(localStorage.getItem('liked'));
            }

            // 실패 시 롤백을 위해 이전 상태 보관
            const prevState = {
                alreadyLiked: this.alreadyLiked,
                likeCount: this.likeCount,
                likedList: [...liked]
            };

            if (this.alreadyLiked) {
                // 좋아요 취소
                liked = liked.filter(item => this.postId !== item);
                this.alreadyLiked = false;
                this.likeCount -= 1;
                this.changeLikeCount(this.postId, -1, prevState);
            } else {
                // 좋아요
                liked.push(this.postId);
                this.alreadyLiked = true;
                this.likeCount += 1;
                this.changeLikeCount(this.postId, +1, prevState);
            }
            localStorage.setItem('liked', JSON.stringify(liked));
        },
        changeLikeCount(postId, likeCount, prevState) {
            axios({
               url: window.mytory_ajax.ajax_url,
               method: 'post',
               params: {
                   action: 'change_like_count',
                   ID: postId,
                   like_count: likeCount,
                   nonce: this.nonce
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
                    // 실패 시 이전 상태로 롤백
                    if (prevState) {
                        this.alreadyLiked = prevState.alreadyLiked;
                        this.likeCount = prevState.likeCount;
                        localStorage.setItem('liked', JSON.stringify(prevState.likedList));
                    }
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
