/**
 * @deprecated : 서비스와 맞지않은 이미지
 */
function main() {
    const asideImg = document.querySelector('#aside-img');
    asideImg.addEventListener('click', (e) => {
        swal('무엇을 도와드릴까요?', '관리자 : moomin970131@daum.net', 'info');
    });
}
// main();
