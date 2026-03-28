<?php
namespace Mytory\Like;
use Mytory\AjaxVariable\MytoryAjaxVariable;

/**
 * Mytory Board의 확장팩 성격의 좋아요 모듈.
 * Class MytoryLike
 */
class MytoryLike {
	public function __construct() {
		new MytoryAjaxVariable();

		add_action( 'wp_ajax_change_like_count', [ $this, 'change' ] );
		add_action( 'wp_ajax_nopriv_change_like_count', [ $this, 'change' ] );
	}

	public function change() {
		// 1. 보안 검증: Nonce 체크 (실패 시 친절한 메시지 반환)
		if ( ! check_ajax_referer( 'mytory_like_nonce', 'nonce', false ) ) {
			echo json_encode( [
				'result'    => 'error',
				'message'   => '보안 세션이 만료되었거나 올바르지 않은 접근입니다. 페이지를 새로고침한 후 다시 시도해 주세요.',
			] );
			die();
		}

		// 2. 데이터 정제 및 오타 수정
		$post_id    = absint( $_REQUEST['ID'] );
		$diff       = (int) $_REQUEST['like_count'];
		
		$like_count = get_post_meta( $post_id, '_mytory_like_count', true ) ?: 0;
		$like_count += $diff;

		// 음수 방지
		$like_count = max( $like_count, 0 );

		// 3. 업데이트 및 결과 확인
		update_post_meta( $post_id, '_mytory_like_count', $like_count );
		$final_count = get_post_meta( $post_id, '_mytory_like_count', true );

		echo json_encode( [
			'result'    => 'success',
			'message'   => '좋아요 ' . $diff,
			'likeCount' => (int) $final_count,
		] );

		die();
	}

}
