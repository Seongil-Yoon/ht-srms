const getItemList = (page) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/items?pageNum=${page}`,
            type: 'get',
            dataType: 'json', //json 으로 받기
            success: function (result, jqxHr) {
                resolve(result);
            },
            error: function (error) {
                //서버오류 500, 찾는 자료없음 404, 권한없음 403, 인증실패 401
                if (error.status == 404) {
                    swal('찾는 자료가 없습니다', '', 'error');
                } else if (error.status == 401) {
                    swal('유효하지 않은 인증입니다', '', 'error');
                } else if (error.status == 403) {
                    swal('접근 권한이 없습니다', '', 'error');
                } else if (error.status == 500) {
                    swal('서버 오류 관리자에게 문의 하세요', '', 'error');
                } else {
                    // swal(`${error.message}`, '', 'error');
                }
                reject(error);
            },
        }); //end of ajax
    });
};

export default getItemList;
