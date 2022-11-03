const asideImg = document.querySelector('#aside-img');

function main() {
    
    asideImg.addEventListener('click', (e) => {
        swal('무엇을 도와드릴까요?','관리자 : moomin970131@daum.net','info');
    });
}
main();
