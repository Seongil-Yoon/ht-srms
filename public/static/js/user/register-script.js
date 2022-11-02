import {registerForm, formDom} from './dom/register-form-dom.js';
import {userDto} from './model/user-dto.js';
import {formIsChecked, userUtill, reg} from './utill/validation.js';
import customUtill from '../custom-utill.js';

// const userDTO = new userDto('dbs267', 'ddf');

async function registerSubmit(e) {
    e.preventDefault();
    let formFalseKey = undefined;
    let formIsTrueValue = false;

    userDto.userName = formDom.userNameDom.value;
    userDto.userDept = formDom.userDeptDom.value;
    userDto.userPosition = formDom.userPositionDom.value;

    formFalseKey = customUtill.getKeyByValue(formIsChecked, false);
    formIsTrueValue = customUtill.getValueByKey(formIsChecked, formFalseKey); //undefined 또는 true은 통과
    if (formIsTrueValue === undefined) formIsTrueValue = true;

    if (formIsTrueValue) {
        //폼 검증 통과
        swal({
            title: `회원가입 하시겠습니까?`,
            text: '',
            icon: 'info',
            buttons: true,
            dangerMode: true,
        }).then((e) => {
            if (e) {
                $.ajax({
                    url: '/register',
                    type: 'post',
                    data: JSON.stringify(userDto),
                    contentType: 'application/json',
                    success: function (res, jqxHR) {
                        if (res.ok === true) {
                            swal(
                                '가입을 축하합니다🎉',
                                '다시 로그인해주세요',
                                'success'
                            );
                            setTimeout(() => (location.href = '/'), 2000);
                        } else {
                            swal('', '항목을 다시 확인해주세요', 'error');
                        }
                    },
                    error: function (error) {
                        //서버오류 500  찾는 자료없음 404  권한없음  401
                        if (error.status == 404) {
                            swal('찾는 자료가 없습니다', '', 'error');
                        } else if (error.status == 401) {
                            swal('유효하지 않은 인증입니다', '', 'error');
                        } else if (error.status == 403) {
                            swal('접근 권한이 없습니다', '', 'error');
                        } else if (error.status == 500) {
                            swal(
                                '서버 오류 관리자에게 문의 하세요',
                                '',
                                'error'
                            );
                        } else if (error.status == 409) {
                            swal('입력 안 된 항목이 있습니다', '', 'error');
                        }
                    },
                });
            }
        });
    } else {
        swal('', '항목을 다시 확인해주세요', 'error');
    }
}

function main() {
    formDom.userIdDom.addEventListener('focusin', async (e) => {
        // e.target.nextSibling.nextSibling.style.display = 'inline';
        // console.log(e.target.nextSibling.nextSibling);
        // console.log(formDom.userIdDom.parentNode.childNodes);
    });
    formDom.userIdDom.addEventListener('focusout', userUtill.userIdCheck);
    formDom.passwordDom.addEventListener('keyup', userUtill.passwordCheck);
    formDom.passwordConfirmDom.addEventListener(
        'keyup',
        userUtill.passworldConfirmCheck
    );
    formDom.userEmailDom.addEventListener('keyup', userUtill.userEmailCheck);

    registerForm.addEventListener('submit', registerSubmit);
}
main();
