<?php
namespace Mytory\Like;
/**
 * Mytory Board의 확장팩 성격의 좋아요 모듈.
 * Class MytoryLike
 */
class MytoryLike {
	public function __construct() {
		add_action( 'wp_ajax_change_like_count', [ $this, 'change' ] );
		add_action( 'wp_ajax_nopriv_change_like_count', [ $this, 'change' ] );
	}

	public function change() {
		$like_count = get_post_meta( $_REQUEST['ID'], '_mytory_like_count', true ) ?: 0;
		$like_count += $_REQUEST['like_count'];

		// 음수방지
		$like_count = max( $like_count, 0 );

		if ( update_post_meta( $_REQUEST['ID'], '_mytory_like_count', $like_count ) ) {
			echo json_encode( [
				'result'    => 'success',
				'message'   => '좋아요 ' . $_REQUEST['count'],
				'likeCount' => $like_count,
			] );
		} else {
			echo json_encode( [
				'result'    => 'error',
				'message'   => '오류가 발생했습니다.',
				'likeCount' => $like_count,
			] );
		}

		die();
	}

}

new MytoryLike();