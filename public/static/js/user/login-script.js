// import httpHeaders from '../httpHeaders.js';
// const token = localStorage.getItem('accessToken');
const loginForm = document.querySelector('#js-loginForm');
const valiAlert = loginForm.querySelector('span');

const userDto = {
    userId: undefined,
    userPassword: undefined,
};

async function loginSubmit(e) {
    e.preventDefault();
    userDto.userId = document.getElementsByName('userId')[0].value;
    userDto.userPassword = document.getElementsByName('userPassword')[0].value;

    if (userDto.userId != undefined && userDto.userPassword != undefined) {
        await $.ajax({
            url: '/login',
            type: 'post',
            data: JSON.stringify(userDto), //객체를 json 문자열로 반환 해서보냄 서버와는 문자열로통신
            contentType: 'application/json', //json 으로 데이터줄때 사용,
            success: function (result, jqxHR) {
                console.log(result);
                if (result.ok == true) {
                    //로그인 성공후 메인 화면 이동
                    swal('로그인 되었습니다', '', 'success');
                    setTimeout(() => {
                        location.href = '/item-manage-page';
                    }, 1.1 * 1000);
                } else {
                    valiAlert.style.visibility = 'unset';
                }
            },
            error: function (error) {
                //서버오류 500  찾는 자료없음 404  권한없음  401
                console.log(error);
                if (error.status == 404) {
                    swal('찾는 자료가 없습니다', '', 'error');
                } else if (error.status == 401) {
                    valiAlert.innerText = error.responseJSON.message
                    valiAlert.style.visibility = 'unset';
                } else if (error.status == 403) {
                    swal('접근 권한이 없습니다', '', 'error');
                } else if (error.status == 500) {
                    swal('서버 오류 관리자에게 문의 하세요', '', 'error');
                }
            },
        });
    } else {
        swal('입력되지 않은 항목이 있습니다', '', 'error');
    }
}
function main() {
    loginForm.addEventListener('submit', loginSubmit);
}
main();
