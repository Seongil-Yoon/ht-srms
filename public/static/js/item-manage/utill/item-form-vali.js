import {dom as itemDom} from '../dom/item-insert-dom.js';
import {itemDto} from '../model/item-dto.js';
import htSwal from '../../custom-swal.js';
import customUtill from '../../custom-utill.js';

const itemIdReg = /^[a-zA-Z]{2}[0-9]*$/;

const itemIdChkMap = {
    isPassReg: false,
    isPassDup: false,
    result: {
        ok: false,
        message: '제품 코드를 입력해주십시오',
    },
};
const itemVali = {
    itemIdRegChk: async (e, itemId) => {
        if (e === undefined && itemId === '') {
            itemIdChkMap.result.ok = false;
            itemIdChkMap.result.message =
                '❌영문자2자리 + 숫자 조합으로 입력해주십시오';
            itemDom.itemIdCheckAlarm.style.display = 'inline';
            itemDom.itemIdCheckAlarm.style.color = 'red';
            itemDom.itemIdCheckAlarm.innerText = itemIdChkMap.result.message;
            return itemIdChkMap.result;
        }

        let _itemId = itemId || e.target.value;
        itemIdChkMap.isPassReg = itemIdReg.test(_itemId);
        if (itemIdChkMap.isPassReg) {
            itemIdChkMap.result = await itemVali.itemIdDupChk(_itemId);
            if (itemIdChkMap.result.ok === false) {
                itemDom.itemIdCheckAlarm.style.display = 'inline';
                itemDom.itemIdCheckAlarm.style.color = 'red';
                itemDom.itemIdCheckAlarm.innerText = `❌${itemIdChkMap.result.message}`;
            } else {
                itemDom.itemIdCheckAlarm.style.display = 'inline';
                itemDom.itemIdCheckAlarm.style.color = 'black';
                itemDom.itemIdCheckAlarm.innerText = `✅${itemIdChkMap.result.message}`;
            }
        } else {
            itemIdChkMap.result.ok = false;
            itemIdChkMap.result.message =
                '❌영문자2자리 + 숫자 조합으로 입력해주십시오';
            itemDom.itemIdCheckAlarm.style.display = 'inline';
            itemDom.itemIdCheckAlarm.style.color = 'red';
            itemDom.itemIdCheckAlarm.innerText = itemIdChkMap.result.message;
        }
        return itemIdChkMap.result;
    },
    itemIdDupChk: async (itemId) => {
        itemIdChkMap.isPassDup = false;
        if (itemIdChkMap.isPassReg) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: '/item/vali-itemid',
                    type: 'post',
                    data: JSON.stringify({itemId}),
                    contentType: 'application/json',
                    success: function (res, jqxHR) {
                        itemIdChkMap.isPassDup = true;
                        resolve(res);
                    },
                    error: function (error) {
                        //서버오류 500, 찾는 자료없음 404, 권한없음 403, 인증실패 401
                        if (error.status == 404) {
                            htSwal.fire('찾는 자료가 없습니다', '', 'error');
                        } else if (error.status == 401) {
                            htSwal.fire(
                                '유효하지 않은 인증입니다',
                                '',
                                'error'
                            );
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
                });
            }); //end of promise
        }
    },
};

export {itemVali, itemIdChkMap};
