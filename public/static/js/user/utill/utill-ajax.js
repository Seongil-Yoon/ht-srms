const result = {
    ok: false,
    status: 500,
    message: '',
};

const utillAjax = {
    idDuplicateCheck: (userId) => {
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
                        result.status = 200;
                        result.message = '사용가능한 사번입니다';
                    } else {
                        result.ok = false;
                        result.status = 401;
                        result.message = '❌이미 등록된 사람입니다';
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
                        result.status = 401;
                        result.message = error.responseJSON.message;
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
