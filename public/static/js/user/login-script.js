// import httpHeaders from '../httpHeaders.js';
// const token = localStorage.getItem('accessToken');
import {userDto} from './model/user-dto.js';
const loginForm = document.querySelector('#js-loginForm');
const notifyTarget = document.querySelector('#notify_target');
const valiAlert = loginForm.querySelector('span');
let notify_5 = undefined;
const urlParams = new URLSearchParams(window.location.search);
const urlParamsValue = {
    isOk: urlParams.get('ok'),
    msg: decodeURI(urlParams.get('msg')),
};

async function loginSubmit(e) {
    e.preventDefault();
    // const userDTO = new userDto.Builder()
    //     .setUserId('asd')
    //     .setUserPassword('asd');

    userDto.userId = document.getElementsByName('userId')[0].value;
    userDto.userPassword = document.getElementsByName('userPassword')[0].value;
    try {
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
                    if (error.status == 404) {
                        swal('찾는 자료가 없습니다', '', 'error');
                    } else if (error.status == 401) {
                        valiAlert.innerText = error.responseJSON.message;
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
    } catch (error) {
        console.log(error);
    }
}
function main() {
    if (
        urlParamsValue.isOk === 'false' &&
        urlParamsValue.msg === 'No authenticated!'
    ) {
        jui.ready(['ui.notify'], function (notify) {
            notify_5 = notify('#notify_target', {
                position: 'bottom-right',
                timeout: 0,
                showDuration: 1000,
                tpl: {
                    item: $('#tpl_alarm').html(),
                },
            });

            const notify_bottom_submit = (type, color) => {
                let data = {
                    title: '인증정보가 만료되어 자동 로그아웃 되었습니다',
                    message: '다시 로그인해 주시기 바랍니다',
                    color: color,
                };

                if (type == 6) notify_5.add(data);
            };
            notify_bottom_submit(6, 'warning');
        });
    }
    loginForm.addEventListener('submit', loginSubmit);
}
main();
