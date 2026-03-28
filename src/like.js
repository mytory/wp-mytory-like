const axios = require('axios');

// 페이지 내의 모든 공감 버튼을 찾아 각각 Vue 인스턴스로 만듭니다.
document.querySelectorAll('.js-like-button').forEach(el => {
    new Vue({
        el: el,
        data: {
            postId: parseInt(el.dataset.postId),
            nonce: el.dataset.nonce,
            alreadyLiked: false,
            likeCount: parseInt(el.dataset.likeCount),
            loading: false
        },
        methods: {
            toggle() {
                if (this.loading) return;

                let liked = this.getLikedList();

                // 실패 시 롤백을 위해 이전 상태 보관
                const prevState = {
                    alreadyLiked: this.alreadyLiked,
                    likeCount: this.likeCount,
                    likedList: [...liked]
                };

                this.loading = true;

                if (this.alreadyLiked) {
                    // 좋아요 취소
                    liked = liked.filter(item => this.postId !== item);
                    this.alreadyLiked = false;
                    this.likeCount -= 1;
                    this.changeLikeCount(-1, prevState);
                } else {
                    // 좋아요
                    if (liked.indexOf(this.postId) === -1) {
                        liked.push(this.postId);
                    }
                    this.alreadyLiked = true;
                    this.likeCount += 1;
                    this.changeLikeCount(+1, prevState);
                }
                this.saveLikedList(liked);
                this.updateSharedCount(this.likeCount); // 로컬 숫자 공유
                
                // 클릭 애니메이션
                this.$el.classList.add('is-animating');
                setTimeout(() => this.$el.classList.remove('is-animating'), 300);
            },
            changeLikeCount(diff, prevState) {
                axios({
                    url: window.mytory_ajax.ajax_url,
                    method: 'post',
                    params: {
                        action: 'change_like_count',
                        ID: this.postId,
                        like_count: diff,
                        nonce: this.nonce
                    }
                })
                .then(res => {
                    if (res.data.result === 'success') {
                        this.likeCount = res.data.likeCount;
                        this.updateSharedCount(this.likeCount); // 서버에서 받은 정확한 숫자 공유
                    } else {
                        throw res.data.message;
                    }
                })
                .catch(error => {
                    alert(error);
                    if (prevState) {
                        this.alreadyLiked = prevState.alreadyLiked;
                        this.likeCount = prevState.likeCount;
                        this.saveLikedList(prevState.likedList);
                        this.updateSharedCount(this.likeCount);
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
            },
            getLikedList() {
                try {
                    return JSON.parse(localStorage.getItem('liked')) || [];
                } catch (e) {
                    return [];
                }
            },
            saveLikedList(list) {
                localStorage.setItem('liked', JSON.stringify(list));
            },
            // 다른 탭과 숫자를 공유하기 위한 메서드
            updateSharedCount(count) {
                let counts = {};
                try {
                    counts = JSON.parse(localStorage.getItem('like_counts')) || {};
                } catch (e) {}
                counts[this.postId] = count;
                localStorage.setItem('like_counts', JSON.stringify(counts));
            },
            syncState() {
                // 1. 하트 색깔(상태) 동기화
                const liked = this.getLikedList();
                this.alreadyLiked = (liked.indexOf(this.postId) > -1);

                // 2. 숫자(텍스트) 동기화
                try {
                    const counts = JSON.parse(localStorage.getItem('like_counts')) || {};
                    if (counts[this.postId] !== undefined) {
                        this.likeCount = counts[this.postId];
                    }
                } catch (e) {}
            }
        },
        mounted() {
            this.syncState();
            
            // 다른 탭에서 상태나 숫자가 변경될 때 동기화
            window.addEventListener('storage', (e) => {
                if (e.key === 'liked' || e.key === 'like_counts') {
                    this.syncState();
                }
            });
        }
    });
});
