const htSwal = Swal.mixin({
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
});
function logout() {
    $.ajax({
        url: '/logout',
        type: 'post',
        success: function () {
            //로그아웃후  메인 화면 이동
            location.href = '/';
        },
        error: function (error) {
            //서버오류 500  찾는 자료없음 404  권한없음  401
            if (error.status == 404) {
                htSwal.fire('찾는 자료가 없습니다', '', 'error');
            } else if (error.status == 401) {
                htSwal.fire('유효하지 않은 인증입니다', '', 'error');
            } else if (error.status == 403) {
                htSwal.fire('접근 권한이 없습니다', '', 'error');
            } else if (error.status == 500) {
                htSwal.fire('서버 오류 관리자에게 문의 하세요', '', 'error');
            }
        },
    });
}
