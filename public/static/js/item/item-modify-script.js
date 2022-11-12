import {dom as itemModifyDom} from './dom/item-modify-dom.js';
import {
    itemModifyCategoryLargeAddEvent,
    itemModifyCategorySmallAddEvent,
    itemModifyCategoryRender,
} from './item-modify-category-event.js';
import {itemDto} from './model/item-dto.js';
import {DateTime} from '../../libs/luxon.min.js';

let newItemDto = itemDto;
let newDropdown, newTable;
const itemIdReg = /^[A-Z]{2}[0-9]{14}$/;
let submitClickResult = undefined;

const showModifyModal = async (e) => {
    $('section.item-modify-modal-overlay').css('display', 'unset');
    await itemModifyCategoryRender(newItemDto);
    itemModifyDom.itemNameModify.value = newItemDto.itemName;
    if (newItemDto.itemIsCanRent === true) {
        itemModifyDom.itemIsCanRentModify[0].checked = true;
        itemModifyDom.itemIsCanRentModify[1].checked = false;
    } else {
        itemModifyDom.itemIsCanRentModify[0].checked = false;
        itemModifyDom.itemIsCanRentModify[1].checked = true;
    }
    if (newItemDto.itemIsNeedReturn === true) {
        itemModifyDom.itemIsNeedReturnModify[0].checked = true;
        itemModifyDom.itemIsNeedReturnModify[1].checked = false;
    } else {
        itemModifyDom.itemIsNeedReturnModify[0].checked = false;
        itemModifyDom.itemIsNeedReturnModify[1].checked = true;
    }
    itemModifyDom.itemIdModify.value = newItemDto.itemId;
    itemModifyDom.itemTotalAmountModify.value = newItemDto.itemTotalAmount;
};
const itemModifySubmitClick = async (e) => {
    e.preventDefault();
    const ajax = () => {
        return new Promise((resolve, reject) => {
            newItemDto.itemCategory.large = document.querySelector(
                '#js-itemCategoryLargeModify'
            ).value;
            newItemDto.itemCategory.small = document.querySelector(
                '#js-itemCategorySmallModify'
            ).value;
            newItemDto.itemName = itemModifyDom.itemNameModify.value;
            newItemDto.itemIsCanRent = $(
                "input[name='itemIsCanRentModify']:checked"
            ).val();
            newItemDto.itemIsNeedReturn = $(
                "input[name='itemIsNeedReturnModify']:checked"
            ).val();
            newItemDto.itemId = itemModifyDom.itemIdModify.value;
            newItemDto.itemTotalAmount =
                itemModifyDom.itemTotalAmountModify.value;
            newItemDto.updatedAt = DateTime.now();

            if (newItemDto.itemCategory.large === '') {
                swal('대분류를 선택해주십시오', '', 'error');
            } else if (newItemDto.itemCategory.small === '') {
                swal('소분류를 선택해주십시오', '', 'error');
            } else if (newItemDto.itemName === '') {
                swal('물품 이름을 입력해주십시오', '', 'error');
            } else if (!itemIdReg.test(newItemDto.itemId)) {
                swal(
                    '제품코드 규칙을 지켜주십시오',
                    'ex)CO20220600040001(분류(2:A)+도입일(4:N)+수량(4:N)+순번(4:N))',
                    'error'
                );
            } else if (newItemDto.itemTotalAmount < 1) {
                swal('물품 수량은 최소 1개이상 허용됩니다', '', 'error');
            } else {
                swal({
                    title: `물품을 편집하시겠습니까?`,
                    text: '',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true,
                    buttons: ['닫기', '편집'],
                }).then((e) => {
                    if (e) {
                        $('section.item-modify-modal-overlay').css(
                            'display',
                            'none'
                        );
                        newTable.unselect();
                        $.ajax({
                            url: `/item/${newItemDto.itemNum}`,
                            type: 'put',
                            data: JSON.stringify(newItemDto),
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (res, jqxHR) {
                                if (res.ok === true) {
                                    // swal('물품을 등록했습니다🎉', 'success');
                                    resolve(res);
                                    
                                    setTimeout(() => (location.href = '/'));
                                } else {
                                    swal(
                                        '서버 오류 관리자에게 문의 하세요',
                                        '',
                                        'error'
                                    );
                                }
                            },
                            error: function (error) {
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
            }
        }); //end of promise
    };
    submitClickResult = await ajax();
    console.log(submitClickResult);
};
const itemModifyCancelClick = (e) => {
    e.preventDefault();
    $('section.item-modify-modal-overlay').css('display', 'none');
    newTable.unselect();
};

const ItemModifyEvent = {
    /**
     * @param : 물품1개, 드랍다운, 테이블
     * @return :
     * @dom :
     */
    main: async (targetItem, dropdown, table) => {
        newItemDto = targetItem;
        newDropdown = dropdown;
        newTable = table;
        showModifyModal();
        itemModifyDom.itemCategoryLargeModifyAddInsert.addEventListener(
            'click',
            itemModifyCategoryLargeAddEvent.itemCategoryLargeAddSelect
        );
        itemModifyDom.itemCategorySmallModifyAddInsert.addEventListener(
            'click',
            itemModifyCategorySmallAddEvent.itemCategorySmallAddSelect
        );
        $("form#js-itemModifyForm button[id='js-itemModifySubmit']").on(
            'click',
            itemModifySubmitClick
        );
        $("form#js-itemModifyForm button[id='js-itemModifyCancel']").on(
            'click',
            itemModifyCancelClick
        );
    },
    getResult: async() => {
        return new Promise((resolve, reject) => {
            console.log(submitClickResult);
            resolve(submitClickResult);
        });
    },
};

export default ItemModifyEvent;
