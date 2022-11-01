import {registerForm, formDom} from './dom/register-form-dom.js';
import {userDto} from './model/user-dto.js';
import {formIsChecked, userUtill, reg} from './utill/validaion.js';

// const userDTO = new userDto('dbs267', 'ddf');

async function registerSubmit(e) {
    e.preventDefault();
    let pwdCheck = userUtill.passwordCheck(
        formDom.passwordDom.value,
        formDom.passwordConfirmDom.value
    );
    console.log(formIsChecked.passwordIsCheck);
}

function main() {
    formDom.userIdDom.addEventListener('focusin', (e) => {
        // e.target.nextSibling.nextSibling.style.display = 'inline';
        // console.log(e.target.nextSibling.nextSibling);
        // console.log(formDom.userIdDom.parentNode.childNodes);
    });
    formDom.userIdDom.addEventListener('focusout', userUtill.userIdCheck);

    registerForm.addEventListener('submit', registerSubmit);
}
main();
