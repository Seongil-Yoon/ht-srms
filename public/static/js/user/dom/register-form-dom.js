const registerForm = document.querySelector('#js-registerForm');
const formDom = {
    userIdDom: registerForm.querySelector('#js-userId'),
    userNameDom: registerForm.querySelector('#js-userName'),
    passwordDom: registerForm.querySelector('#js-userPassword'),
    passwordConfirmDom: registerForm.querySelector('#js-passwordConfirm'),
    userEmailDom: registerForm.querySelector('#js-userEmail'),
    userDeptDom: registerForm.querySelector('#js-userDept'),
    userPositionDom: registerForm.querySelector('#js-userPosition'),
};

export {registerForm, formDom};