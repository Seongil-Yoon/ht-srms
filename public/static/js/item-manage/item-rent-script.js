import {dom as rentDom} from './dom/item-rent-dom.js';
import {itemDto} from './model/item-dto.js';
import {rentDto} from './model/rent-dto.js';
import htSwal from '../custom-swal.js';
import {DateTime} from '../../libs/luxon.min.js';
// import flatpickr from '../../libs/flatpickr.min.js';

let newItemDto, newRentDto;
let newDropdown, newTable;

const showRentModal = (item) => {
    $('section.item-rent-modal-overlay').css('display', 'unset');
    rentDom.itemCategoryLargeRent.value = newItemDto.itemCategory.large;
    rentDom.itemCategorySmallRent.value = newItemDto.itemCategory.small;
    rentDom.itemNameRent.value = newItemDto.itemName;
    rentDom.itemIdRent.value = newItemDto.itemId;
    rentDom.rentPurpose.value = '';
    rentDom.rentAt.value = DateTime.now().toISO().substring(0, 16);
    rentDom.expectReturnAt.value = '';

    // rentDom.rentAt.value = DateTime.now().setZone('Europe/London').toISO().substring(0, 19);
    if (newItemDto.itemIsNeedReturn == false) {
        rentDom.expectReturnWarn.style.display = 'none';
        rentDom.expectReturnAt.style.display = 'none';
        rentDom.itemNeedNotReturnAlarm.style.display = 'inline-block';
    } else {
        rentDom.expectReturnWarn.style.display = 'unset';
        rentDom.expectReturnAt.style.display = 'unset';
        rentDom.itemNeedNotReturnAlarm.style.display = 'none';
    }
};
const itemRentFormResetBtnClick = (e) => {
    e.preventDefault();
    rentDom.rentPurpose.value = '';
    rentDom.rentAt.value = DateTime.now().toISO().substring(0, 16);
    rentDom.expectReturnAt.value = '';

};
const itemRentCancelClick = (e) => {
    e.preventDefault();
    htSwal
        .fire({
            title: `대여를 취소하시겠습니까?`,
            text: '',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '네, 대여 취소',
            cancelButtonText: '아니오, 계속 대여',
        })
        .then((e) => {
            if (e.isConfirmed) {
                $('section.item-rent-modal-overlay').css('display', 'none');
            }
        });
};
const ItemRentEvent = {
    main: async (targetItem, dropdown, table) => {
        newItemDto = itemDto;
        newItemDto = targetItem;
        newRentDto = rentDto;
        newDropdown = dropdown;
        newTable = table;
        showRentModal(newItemDto);
        rentDom.itemRentFormResetBtn.addEventListener(
            'click',
            itemRentFormResetBtnClick
        );
        return new Promise((resolve, reject) => {
            const itemRentSubmitClick = (e) => {
                let isPassed = true;
                let nowTime = DateTime.now().toISO().substring(0, 16);
                e.preventDefault();
                newRentDto.rentedItem._id = newItemDto._id;
                newRentDto.rentedItem.itemNum = newItemDto.itemNum;
                newRentDto.rentedItem.itemId = newItemDto.itemId;
                newRentDto.rentedItem.itemName = newItemDto.itemName;
                newRentDto.rentedItem.itemCategory = newItemDto.itemCategory;
                newRentDto.rentPurpose = rentDom.rentPurpose.value;
                newRentDto.rentAt = rentDom.rentAt.value;
                newRentDto.expectReturnAt = rentDom.expectReturnAt.value;

                if (newRentDto.rentPurpose === '') {
                    isPassed = false;
                    htSwal.fire('대여 목적을 입력해주십시오', '', 'error');
                } else {
                    if (newItemDto.itemIsNeedReturn === true) {
                        if (newRentDto.rentAt === '') {
                            isPassed = false;
                            htSwal.fire(
                                '대여 기일을 입력해주십시오',
                                '',
                                'error'
                            );
                        } else {
                            if (newRentDto.rentAt < nowTime) {
                                isPassed = false;
                                htSwal
                                    .fire({
                                        title: '현재시각 이전은 대여할 수 없습니다',
                                        html: '대여 기일이 현재시각으로 자동 변경됩니다',
                                        icon: 'info',
                                    })
                                    .then((e) => {
                                        if (e.isConfirmed) {
                                            nowTime = DateTime.now()
                                                .toISO()
                                                .substring(0, 16);
                                            rentDom.rentAt.value = nowTime;
                                            newRentDto.rentAt =
                                                rentDom.rentAt.value;
                                        }
                                    });
                            } else {
                                if (newRentDto.expectReturnAt === '') {
                                    isPassed = false;
                                    htSwal.fire(
                                        '반납 기한을 입력해주십시오',
                                        '',
                                        'error'
                                    );
                                } else if (
                                    newRentDto.expectReturnAt <
                                    newRentDto.rentAt
                                ) {
                                    //반납일보다 대여일이 나중에일때
                                    isPassed = false;
                                    htSwal
                                        .fire({
                                            title: '대여 기일보다 이전은 반납할 수 없습니다',
                                            html: '반납 기한이 대여 기일 이후로 자동 변경됩니다',
                                            icon: 'info',
                                            width: 'max-content',
                                        })
                                        .then((e) => {
                                            if (e.isConfirmed) {
                                                nowTime = DateTime.now()
                                                    .plus({minutes: 5})
                                                    .toISO()
                                                    .substring(0, 16);
                                                rentDom.expectReturnAt.value =
                                                    nowTime;
                                                newRentDto.expectReturnAt =
                                                    rentDom.expectReturnAt.value;
                                            }
                                        });
                                }
                            }
                        } //end of if(newRentDto.rentAt === '')
                    } else {
                        //반납이 필요 없을때
                        rentDom.expectReturnAt.value = '';
                        newRentDto.expectReturnAt =
                            rentDom.expectReturnAt.value;
                        if (newRentDto.rentAt === '') {
                            isPassed = false;
                            htSwal.fire(
                                '대여 기일을 입력해주십시오',
                                '',
                                'error'
                            );
                        } else {
                            if (newRentDto.rentAt < nowTime) {
                                isPassed = false;
                                htSwal
                                    .fire({
                                        title: '현재시각 이전은 대여할 수 없습니다',
                                        html: '대여 기일이 현재시각으로 자동 변경됩니다',
                                        icon: 'info',
                                    })
                                    .then((e) => {
                                        if (e.isConfirmed) {
                                            nowTime = DateTime.now()
                                                .toISO()
                                                .substring(0, 16);
                                            rentDom.rentAt.value = nowTime;
                                            newRentDto.rentAt =
                                                rentDom.rentAt.value;
                                        }
                                    });
                            }
                        } //end of if(newRentDto.rentAt === '')
                    } //end of if(newItemDto.itemIsNeedReturn === true)
                } //end of outter if

                if (isPassed) {
                    htSwal
                        .fire({
                            title: `${newRentDto.rentedItem.itemName}을(를) </br> 대여하시겠습니까?`,
                            html: (() => {
                                if (newItemDto.itemIsNeedReturn === true)
                                    return `반납 기한 : <span style="color: red;">${DateTime.fromISO(
                                        newRentDto.expectReturnAt
                                    ).toLocaleString(
                                        DateTime.DATETIME_SHORT
                                    )}</span>`;
                                else return `반납할 필요가 없습니다`;
                            })(),
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: '네, 대여하기',
                            cancelButtonText: '아니오, 닫기',
                        })
                        .then((e) => {
                            if (e.isConfirmed) {
                                $('section.item-rent-modal-overlay').css(
                                    'display',
                                    'none'
                                );
                                $.ajax({
                                    url: `/item/${newRentDto.rentedItem._id}/rent`,
                                    type: 'post',
                                    data: JSON.stringify(newRentDto),
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (res, jqxHR) {
                                        if (res.ok === true) {
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
                                            if (
                                                error.responseJSON.message ===
                                                undefined
                                            )
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
                            }
                        }); //end of htSwal.fire-popup
                }
            };

            rentDom.itemRentCancel.addEventListener(
                'click',
                itemRentCancelClick
            );
            rentDom.itemRentSubmit.addEventListener(
                'click',
                itemRentSubmitClick
            );
        });
    },
};

const ItemIsCanRentChkEvent = {
    main: async (targetItem, dropdown, table) => {
        newItemDto = itemDto;
        newItemDto = targetItem;
        newRentDto = rentDto;
        newRentDto.rentedItem._id = newItemDto._id;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/item/${newRentDto.rentedItem._id}/iscanrent`,
                type: 'get',
                dataType: 'json',
                success: function (res, jqxHR) {
                    if (res.ok === true) {
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
                    //서버오류 500, 찾는 자료없음 404, 권한없음 403, 인증실패 401
                    if (error.status == 404) {
                        htSwal.fire('찾는 자료가 없습니다', '', 'error');
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
    },
};

export {ItemRentEvent, ItemIsCanRentChkEvent};
