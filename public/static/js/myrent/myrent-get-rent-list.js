import htSwal from '../custom-swal.js';
import {rentDto} from '../item-manage/model/rent-dto.js';

/**
 * 각 사용자당 대여목록, 사용자식별은 서버단에서 JWT토큰 검증.
 * @param : pageNum
 * @returns : rentlist : [{rent}]
 */
const getRentListByUser = (pageNum) => {
    try {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/user/rentlist?pageNum=${pageNum}`,
                type: 'get',
                dataType: 'json', //json 으로 받기
                success: function (res, jqxHr) {
                    resolve(res);
                },
                error: function (error) {
                    //서버오류 500, 찾는 자료없음 404, 권한없음 403, 인증실패 401
                    if (error.status == 404) {
                        // htSwal.fire('찾는 자료가 없습니다', '', 'error');
                    } else if (error.status == 401) {
                        htSwal.fire('유효하지 않은 인증입니다', '', 'error');
                    } else if (error.status == 403) {
                        htSwal.fire('접근 권한이 없습니다', '', 'error');
                    } else if (error.status == 500) {
                        htSwal.fire(
                            '서버 오류 관리자에게 문의 하세요',
                            '',
                            'error'
                        );
                    } else {
                        if (error.responseJSON.message === undefined)
                            htSwal.fire(
                                '서버 오류 관리자에게 문의 하세요',
                                '',
                                'error'
                            );
                        else
                            htSwal.fire({
                                title: `${error.responseJSON.message}`,
                                icon: 'error',
                                width: 'max-content',
                            });
                    }
                },
            }); //end of ajax
        });
    } catch (error) {
        console.log(error);
    }
};
export default getRentListByUser;
