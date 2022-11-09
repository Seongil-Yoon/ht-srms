import {registerForm, formDom} from '../dom/register-form-dom.js';
import {userDto} from '../model/user-dto.js';
import utillAjax from './utill-ajax.js';
/**
 * 회원가입 폼 검증
 */
const reg = {
    idReg: /^[0-9a-z]{3,12}$/,
    pwdReg: /^[0-9a-zA-Z]{4,64}$/,
    emailReg: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};
const formIsChecked = {
    userIdIsRegCheck: false,
    userIdIsDuplicateCheck: false,
    passwordIsCheck: false,
    passworldConfirmIsCheck: false,
};

const userUtill = {
    userIdCheck: async (e) => {
        const checkAlarm = e.target.nextSibling.nextSibling;
        formIsChecked.userIdIsRegCheck = reg.idReg.test(e.target.value);
        if (formIsChecked.userIdIsRegCheck) {
            utillAjax.idDuplicateCheck(e.target.value, e);
        } else {
            checkAlarm.style.display = 'inline';
            checkAlarm.style.color = 'red';
            checkAlarm.innerText = '❌특수문자, 영어 대문자, 한글은 입력할 수 없습니다';
        }
    },
    passwordCheck: (e) => {
        const checkAlarm = e.target.nextSibling.nextSibling;
        formIsChecked.passwordIsCheck = reg.pwdReg.test(e.target.value);
        if (!formIsChecked.passwordIsCheck) {
            formDom.passwordConfirmDom.value = '';
            formDom.passwordConfirmDom.readOnly = true;
            checkAlarm.style.display = 'inline';
        } else {
            formDom.passwordConfirmDom.value = '';
            formDom.passwordConfirmDom.readOnly = false;
            checkAlarm.style.display = 'none';
        }
    },
    passworldConfirmCheck: (e) => {
        const checkAlarm = e.target.nextSibling.nextSibling;
        if (e.target.value != formDom.passwordDom.value) {
            formIsChecked.passworldConfirmIsCheck = false;
            checkAlarm.style.display = 'inline';
        } else {
            checkAlarm.style.display = 'none';
            formIsChecked.passworldConfirmIsCheck = true;
            userDto.userPassword = e.target.value;
        }
    },
    userEmailCheck: (e) => {
        const checkAlarm = e.target.nextSibling.nextSibling;
        formIsChecked.userEmailCheck = reg.emailReg.test(e.target.value);
        if (!formIsChecked.userEmailCheck) {
            checkAlarm.style.display = 'inline';
        } else {
            checkAlarm.style.display = 'none';
            userDto.userEmail = e.target.value;
        }
    },
};

export {formIsChecked, userUtill, reg};
