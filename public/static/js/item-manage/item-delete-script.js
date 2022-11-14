import {itemDto} from './model/item-dto.js';
import {DateTime} from '../../libs/luxon.min.js';

const ItemDeleteEvent = {
    main: async (targetItem, dropdown, table) => {
        return new Promise((resolve, reject) => {
            swal({
                title: `${targetItem.itemName}을(를) 삭제하시겠습니까?`,
                text: `등록순번 : ${targetItem.itemNum}
                        대여 중 수량 : ${targetItem.itemRentingAmount}`,
                icon: 'warning',
                buttons: true,
                dangerMode: true,
                width: 600,
                buttons: ['닫기', '삭제'],
            }).then((e) => {
                if (e) {
                    $('section.item-modify-modal-overlay').css(
                        'display',
                        'none'
                    );
                    $.ajax({
                        url: `/item/${targetItem.itemNum}`,
                        type: 'put',
                        dataType: 'json',
                        success: function (res, jqxHR) {
                            if (res.ok === true) {
                                swal(`${targetItem.itemName}을(를) 삭제했습니다`, 'success');
                                resolve(res);
                            } else {
                                swal(
                                    '서버 오류 관리자에게 문의 하세요',
                                    '',
                                    'error'
                                );
                            }
                        },
                        error: function (error) {
                            reject(error);
                            //서버오류 500, 찾는 자료없음 404, 권한없음 403, 인증실패 401
                            if (error.status == 404) {
                                swal('찾는 자료가 없습니다', '', 'error');
                            } else if (error.status == 401) {
                                swal('유효하지 않은 인증입니다', '', 'error');
                            } else if (error.status == 403) {
                                swal('접근 권한이 없습니다', '', 'error');
                            } else if (error.status == 500) {
                                swal(
                                    '서버 오류 관리자에게 문의 하세요',
                                    '',
                                    'error'
                                );
                            } else {
                                if (error.message != undefined)
                                    swal(`'${error.message}'`, '', 'error');
                                else
                                    swal(
                                        '서버 오류 관리자에게 문의 하세요',
                                        '',
                                        'error'
                                    );
                            }
                        },
                    }); //end of ajax
                }
            }); //end of swal-popup
        });//end of promise
    },//end of main
};

export default ItemDeleteEvent;
