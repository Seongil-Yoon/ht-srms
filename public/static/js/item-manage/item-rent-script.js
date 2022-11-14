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
    rentDom.rentAt.value = '';
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
                e.preventDefault();
                newRentDto.rentedItem._id = newItemDto._id;
                newRentDto.rentedItem.itemNum = newItemDto.itemNum;
                newRentDto.rentedItem.itemId = newItemDto.itemId;
                newRentDto.rentedItem.itemName = newItemDto.itemName;
                newRentDto.rentedItem.itemCategory = newItemDto.itemCategory;
                newRentDto.rentPurpose = rentDom.rentPurpose.value;
                newRentDto.rentAt = rentDom.rentAt.value;
                newRentDto.expectReturnAt = rentDom.expectReturnAt.value;

                htSwal
                    .fire({
                        title: `${newRentDto.rentedItem.itemName}을(를) </br> 대여하시겠습니까?`,
                        text: '',
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
                                        // htSwal.fire('물품을 등록했습니다🎉', 'success');
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
export default ItemRentEvent;
