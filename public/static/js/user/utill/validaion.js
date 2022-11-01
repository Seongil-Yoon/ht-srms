import {userDto} from '../model/user-dto.js';
import utillAjax from './utill-ajax.js';
/**
 * 회원가입 폼 검증
 */
const reg = {
    idReg: /^[0-9a-z]{3,12}$/,
    pwdReg: /^[0-9a-zA-Z]{4,64}$/,
    emailReg:
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
};
const formIsChecked = {
    userIdIsCheck: {
        isReg: false,
        isDuplicate: false,
    },
    passwordIsCheck: false,
};

const userUtill = {
    userIdCheck: async (e) => {
        const checkAlarm = e.target.nextSibling.nextSibling;
        formIsChecked.userIdIsCheck.isReg = reg.idReg.test(e.target.value);
        if (formIsChecked.userIdIsCheck.isReg) {
            const isDuplicate = utillAjax
                .idDuplicateCheck(e.target.value, e)
                .then((result) => {
                    return new Promise((resolve, reject) => {
                        console.log(result.ok);
                        formIsChecked.userIdIsCheck.isDuplicate = result.ok;
                        resolve(formIsChecked.userIdIsCheck.isDuplicate);
                    });
                });
        } else {
            checkAlarm.style.display = 'inline';
            checkAlarm.style.color = 'red';
            checkAlarm.innerText = '❌특수문자나 한글은 입력할 수 없습니다';
        }
    },
    passwordCheck: (p1, p2) => {
        if (p1 != p2) {
            formIsChecked.passwordIsCheck = false;
            return false;
        }
        formIsChecked.passwordIsCheck = true;
        return true;
    },
};

export {formIsChecked, userUtill, reg};
