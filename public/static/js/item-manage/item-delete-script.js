import {itemDto} from './model/item-dto.js';
import {DateTime} from '../../libs/luxon.min.js';
import htSwal from '../custom-swal.js';

const ItemDeleteEvent = {
    main: async (targetItem, dropdown, table) => {
        return new Promise((resolve, reject) => {
            htSwal
                .fire({
                    title:
                        `${targetItem.itemName}을(를)` +
                        `</br>` +
                        `삭제하시겠습니까?`,
                    html:
                        `등록순번 : ${targetItem.itemNum}` +
                        `</br>` +
                        `대여 중 수량 : ${targetItem.itemRentingAmount}`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '네, 삭제하기',
                    cancelButtonText: '아니오, 닫기',
                })
                .then((e) => {
                    if (e.isConfirmed) {
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
                                    htSwal.fire({
                                        title:
                                            `${targetItem.itemName}을(를)` +
                                            `</br>` +
                                            `삭제했습니다`,
                                        icon: 'success',
                                    });
                                    resolve(res);
                                } else {
                                    htSwal.fire(
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
                                    htSwal.fire(
                                        '찾는 자료가 없습니다',
                                        '',
                                        'error'
                                    );
                                } else if (error.status == 401) {
                                    htSwal.fire(
                                        '유효하지 않은 인증입니다',
                                        '',
                                        'error'
                                    );
                                } else if (error.status == 403) {
                                    htSwal.fire(
                                        '접근 권한이 없습니다',
                                        '',
                                        'error'
                                    );
                                } else if (error.status == 500) {
                                    htSwal.fire(
                                        '서버 오류 관리자에게 문의 하세요',
                                        '',
                                        'error'
                                    );
                                } else {
                                    if (error.message != undefined)
                                        htSwal.fire(
                                            `'${error.message}'`,
                                            '',
                                            'error'
                                        );
                                    else
                                        htSwal.fire(
                                            '서버 오류 관리자에게 문의 하세요',
                                            '',
                                            'error'
                                        );
                                }
                            },
                        }); //end of ajax
                    }
                }); //end of htSwal.fire-popup
        }); //end of promise
    }, //end of main
};

export default ItemDeleteEvent;
