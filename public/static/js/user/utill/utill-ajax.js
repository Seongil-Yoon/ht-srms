import {userDto} from '../model/user-dto.js';
import {formIsChecked, userUtill, reg} from '../utill/validation.js';

const result = {
    ok: false,
    status: 500,
    message: '',
};

/**
 * 원래 validaion.js로 result를 반환하여, 거기서 html을 수정하려 했으나 보류
 */
const utillAjax = {
    idDuplicateCheck: (userId, e) => {
        const checkAlarm = e.target.nextSibling.nextSibling;
        formIsChecked.userIdIsDuplicateCheck = false;

        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/register/vali-userid',
                type: 'post',
                data: JSON.stringify({userId}),
                contentType: 'application/json',
                success: function (res, jqxHR) {
                    console.log('res.ok :', res.ok);
                    if (res.ok == true) {
                        result.ok = true;
                        checkAlarm.style.display = 'inline';
                        checkAlarm.style.color = 'green';
                        checkAlarm.innerText = '사용가능한 사번입니다';
                        formIsChecked.userIdIsDuplicateCheck = true;
                        userDto.userId = e.target.value;
                    } else {
                        result.ok = false;
                        checkAlarm.style.display = 'inline';
                        checkAlarm.style.color = 'red';
                        checkAlarm.innerText = '❌이미 등록된 사번입니다';
                    }
                },
                error: function (error) {
                    //서버오류 500  찾는 자료없음 404  권한없음  401
                    if (error.status == 404) {
                        result.ok = false;
                        result.status = 404;
                        result.message = '찾는 자료가 없습니다';
                    } else if (error.status == 401) {
                        result.ok = false;
                        checkAlarm.style.display = 'inline';
                        checkAlarm.style.color = 'red';
                        checkAlarm.innerText = '❌이미 등록된 사번입니다';
                    } else if (error.status == 403) {
                        result.ok = false;
                        result.status = 403;
                        result.message = '접근 권한이 없습니다';
                    } else if (error.status == 500) {
                        result.ok = false;
                        result.status = 500;
                        result.message = '서버 오류 관리자에게 문의 하세요';
                    }
                },
            });
            resolve(result);
        });
    },
};
export default utillAjax;
