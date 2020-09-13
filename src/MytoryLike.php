<?php
namespace Mytory\Like;
/**
 * Mytory Board의 확장팩 성격의 좋아요 모듈.
 * Class MytoryLike
 */
class MytoryLike {
	public function __construct() {
		add_action( 'wp_head', [ $this, 'globalJsVariable' ] );

		add_action( 'wp_ajax_change_like_count', [ $this, 'change' ] );
		add_action( 'wp_ajax_nopriv_change_like_count', [ $this, 'change' ] );
	}

	public function globalJsVariable() {
		global $wp_query;
		?>
		<script type="text/javascript">
            window.mytory_like = {
                ajax_url: <?= json_encode( admin_url( "admin-ajax.php" ) ); ?>,
                ajax_nonce: <?= json_encode( wp_create_nonce( "mytory-like-ajax-nonce" ) ); ?>,
                wp_debug: <?= defined( WP_DEBUG ) ? WP_DEBUG : 'false' ?>
            };
		</script><?php
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