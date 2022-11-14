import {dom as rentDom} from './dom/item-rent-dom.js';
import {itemDto} from './model/item-dto.js';
import {rentDto} from './model/rent-dto.js';
import {DateTime} from '../../libs/luxon.min.js';
// import flatpickr from '../../libs/flatpickr.min.js';

let newItemDto = itemDto;
let newRentDto = rentDto;
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
    swal({
        title: `대여를 취소하시겠습니까?`,
        text: '',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        buttons: ['닫기', '대여취소'],
    }).then((e) => {
        if (e) {
            $('section.item-rent-modal-overlay').css('display', 'none');
            newTable.unselect();
        }
    });
};
const ItemRentEvent = {
    main: async (targetItem, dropdown, table) => {
        newItemDto = targetItem;
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
                newRentDto.rentedItem.itemNum = newItemDto.itemNum;
                newRentDto.rentedItem.itemId = newItemDto.itemId;
                newRentDto.rentedItem.itemName = newItemDto.itemName;
                newRentDto.rentedItem.itemCategory = newItemDto.itemCategory;
                newRentDto.rentPurpose = rentDom.rentPurpose.value;
                newRentDto.rentAt = rentDom.rentAt.value;
                newRentDto.expectReturnAt = rentDom.expectReturnAt.value;

                swal({
                    title: `${newRentDto.rentedItem.itemName}을(를) 대여하시겠습니까?`,
                    text: '',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                    buttons: ['닫기', '대여'],
                }).then((e) => {
                    if (e) {
                        $('section.item-modify-modal-overlay').css(
                            'display',
                            'none'
                        );
                        $.ajax({
                            url: `/item/${newItemDto.itemNum}`,
                            type: 'patch',
                            data: JSON.stringify(newItemDto),
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (res, jqxHR) {
                                if (res.ok === true) {
                                    // swal('물품을 등록했습니다🎉', 'success');
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
                                    swal(
                                        '유효하지 않은 인증입니다',
                                        '',
                                        'error'
                                    );
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
