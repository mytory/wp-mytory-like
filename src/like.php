<button type="button" class="c-like-button  u-button-like-text  js-like-button  u-margin-right" style="cursor: pointer;"
        data-post-id="<?php echo get_the_ID() ?>"
        data-like-count="<?= get_post_meta(get_the_ID(), '_mytory_like_count', true) ?: 0 ?>"
        @click="toggle">
	<svg class="c-icon-button" :fill="alreadyLiked ? 'red' : 'black'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
	<span v-show="likeCount === 0">
		공감
	</span>
	<span v-cloak v-show="likeCount > 0" :class="alreadyLiked ? 'u-color-red' : ''">
		{{ likeCount }}명이 공감합니다
	</span>
</button>


