import {dom as itemDom} from './dom/item-insert-dom.js';
import {
    itemCategoryLargeAddEvent,
    itemCategorySmallAddEvent,
    itemCategoryRender,
} from './item-category-event.js';
import {itemDto} from './model/item-dto.js';
import htSwal from '../custom-swal.js';
import {
    read,
    readFile,
    writeFileXLSX,
    utils,
    stream,
} from '../../libs/xlsx.mjs';
import customUtill from '../custom-utill.js';
import {itemVali, itemIdChkMap} from './utill/item-form-vali.js';

let table_16, xtable;
/* 등록리스트 csv파싱 데이터 */
let text,
    itemList = [];
let localStoreItemList = JSON.parse(localStorage.getItem('itemList'));
const itemListTableWrap = document.querySelector('#itemListTableWrap');
// 제품코드(16) : 물품분류코드(String : 2), 도입년월(Number : 6), 동일물품수량(Number:4), 동일배치에서순번(Number:4)
let itemIdRegChkEvent = undefined;
const position = {
    pageX: 0,
    pageY: 0,
};

/* ==============================*/
/* ==========  JUI 실행 ==========*/
/* ==============================*/
$(document).on('mousemove', function (event) {
    position.pageX = event.pageX;
    position.pageY = event.pageY;
});
const juiGridXtable = () => {
    let selectRowIndex = 0;
    jui.ready(
        ['util.base', 'grid.xtable', 'ui.dropdown'],
        (_, xtableUI, dropdown) => {
            let dd = dropdown('#xtable_3_dd', {
                event: {
                    change: function (data) {
                        switch (data.value) {
                            case 'delete':
                                itemList.splice(xtable.activeIndex(), 1);
                                xtable.clear();
                                xtable.update(itemList);
                                break;
                            default:
                                dd.hide();
                                // xtable.unselect();
                                break;
                        }
                    },
                },
            });
            xtable = xtableUI('#xtable_3', {
                fields: [
                    null,
                    'itemCategoryLarge',
                    'itemCategorySmall',
                    'itemName',
                    'itemIsCanRent',
                    'itemIsNeedReturn',
                    'itemId',
                    'itemTotalAmount',
                ],
                colshow: [0, 1, 2, 3, 4, 5, 6],
                csvNumber: [0, 1, 2, 3, 4, 5, 6],
                resize: true,
                bufferCount: 40,
                scrollHeight: 350,
                data: itemList,
                event: {
                    scroll: (e) => {
                        // console.log(e);
                    },
                    click: (e) => {
                        // xtable.unselect();
                    },
                    rowmenu: function (row, e) {
                        selectRowIndex = row.index;
                        this.select(selectRowIndex);
                        dd.move(position.pageX, position.pageY);
                        dd.show();
                    },
                },
            });

            //csv, xlsx파일 불러오기
            itemDom.table_16_btn.addEventListener('change', (rootEvent) => {
                let chkResult = undefined;
                const input = rootEvent.target.files[0];
                const reader = new FileReader();
                let tempData = [],
                    backData = [];

                chkResult = customUtill.checkFileName(rootEvent.target.value, [
                    'csv',
                    'xlsx',
                ]);
                reader.onload = async (e) => {
                    if (chkResult === 'csv' || chkResult === 'xlsx') {
                        //CSV파일로 변환
                        const workBook = await customUtill.handleFileAsync(
                            rootEvent
                        );
                        let workSheet = workBook.Sheets[workBook.SheetNames[0]];
                        console.log(workSheet);
                        workSheet = utils.sheet_add_aoa(
                            workSheet,
                            [
                                [
                                    'itemCategoryLarge',
                                    'itemCategorySmall',
                                    'itemName',
                                    'itemIsCanRent',
                                    'itemIsNeedReturn',
                                    'itemId',
                                    'itemTotalAmount',
                                ],
                            ],
                            {
                                origin: 'A1',
                            }
                        );
                        const converted = utils.sheet_to_csv(workSheet);

                        //D3.js를 이용하여 파싱
                        tempData = d3.csvParse(converted);
                        tempData.forEach((element) => {
                            //기존 리스트에 추가하기 위해
                            itemList.push(element);
                        });
                        xtable.clear();
                        xtable.update(itemList);
                    }
                };
                //load the input file to the reader
                reader.readAsText(input);
            }); //end of addEventListener
        }
    );
};
/* ==============================*/
/* ======  end of JUI 실행 ======*/
/* ==============================*/

const itemInsertFormClick = async (e) => {
    e.preventDefault();
    itemDom.itemIdInput.value = itemDom.itemIdInput.value.toUpperCase();
    // itemDto.itemWriter = $("input[name='_id']").val();
    await itemVali.itemIdRegChk(undefined, itemDom.itemIdInput.value, 'insert');
    if ($('#js-itemCategoryLarge').val() === '') {
        htSwal.fire('대분류를 선택해주십시오', '', 'error');
    } else if ($('#js-itemCategorySmall').val() === '') {
        htSwal.fire('소분류를 선택해주십시오', '', 'error');
    } else if ($("input[name='itemName']").val() === '') {
        htSwal.fire('물품 이름을 입력해주십시오', '', 'error');
    } else if (!itemIdChkMap.result.ok) {
        htSwal.fire({
            title:
                `${itemIdChkMap.result.message}` ||
                `제품 코드를 입력해주십시오`,
            icon: 'error',
            width: 'max-content',
        });
    } else if ($("input[name='itemTotalAmount']").val() < 1) {
        htSwal.fire('물품 수량은 최소 1개이상 허용됩니다', '', 'error');
    } else {
        itemDto.itemCategory.large = $('#js-itemCategoryLarge').val();
        itemDto.itemCategory.small = $('#js-itemCategorySmall').val();
        itemDto.itemName = $("input[name='itemName']").val();
        itemDto.itemIsCanRent = $("input[name='itemIsCanRent']:checked").val();
        itemDto.itemIsNeedReturn = $(
            "input[name='itemIsNeedReturn']:checked"
        ).val();
        itemDto.itemId = $("input[name='itemId']").val();
        itemDto.itemTotalAmount = $("input[name='itemTotalAmount']").val();

        /**
         * 
        let founded = itemList.filter((e) => e.itemId === itemDto.itemId);
        if (founded.length > 0) {
            itemDto.itemId = customUtill.incrementString(founded[0].itemId);
            itemDom.itemIdInput.value = itemDto.itemId;
        }
        */
        let founded = itemList.filter((e) => e.itemId === itemDto.itemId);
        if (founded.length > 0) {
            await htSwal
                .fire({
                    title: '등록리스트에 이미있는 물품입니다</br>수정하시겠습니까?',
                    html: `제품 코드 : ${itemDto.itemId}`,
                    width: 'max-content',
                    icon: 'warning',
                    showCancelButton: true,
                })
                .then((e) => {
                    if (e.isConfirmed) {
                        itemList = itemList.map((row) => {
                            if (row.itemId === itemDto.itemId) {
                                let item = {
                                    itemCategoryLarge:
                                        itemDto.itemCategory.large,
                                    itemCategorySmall:
                                        itemDto.itemCategory.small,
                                    itemName: itemDto.itemName,
                                    itemIsCanRent: itemDto.itemIsCanRent,
                                    itemIsNeedReturn: itemDto.itemIsNeedReturn,
                                    itemId: itemDto.itemId,
                                    itemTotalAmount: itemDto.itemTotalAmount,
                                };
                                return item;
                            } else {
                                return row;
                            }
                        });
                    }
                });
        } else {
            itemList.unshift({
                itemCategoryLarge: itemDto.itemCategory.large,
                itemCategorySmall: itemDto.itemCategory.small,
                itemName: itemDto.itemName,
                itemIsCanRent: itemDto.itemIsCanRent,
                itemIsNeedReturn: itemDto.itemIsNeedReturn,
                itemId: itemDto.itemId,
                itemTotalAmount: itemDto.itemTotalAmount,
            });
        }
        console.log(itemList);
        xtable.update(itemList);

        // let child = document.querySelector('tr.selected');
        // let parent = child.parentNode;
    }
};

const itemFormResetBtnClick = async (e) => {
    await itemCategoryRender();
};
const itemListSaveClick = (e) => {
    localStorage.setItem('itemList', JSON.stringify(itemList));
    htSwal.fire({
        title: '물품 리스트를 임시저장했습니다',
        text: '',
        icon: 'info',
    });
};
const itemListResetBtnClick = (e) => {
    itemList = [];
    localStorage.removeItem('itemList');
    localStoreItemList = [];
    xtable.clear();
};

const itemInsertCancelClick = (e) => {
    htSwal
        .fire({
            title: `물품 등록을 취소하시겠습니까?`,
            html: `임시저장 버튼을 눌렀는지 확인바랍니다 </br> 저장하지 않은 물품은 다시 등록해야됩니다`,
            icon: 'question',
            width: 'max-content',
            showCancelButton: true,
            confirmButtonText: '네, 등록 취소',
            cancelButtonText: '아니오, 계속 등록',
        })
        .then((e) => {
            if (e.isConfirmed) {
                location.href = `/item-manage-page`;
            }
        });
};
const itemInsertSubmitClick = (e) => {
    if (itemList.length > 0) {
        htSwal
            .fire({
                title: `물품을 최종등록 하시겠습니까?`,
                html: '등록리스트의 물품을 확인해주십시오 </br> 오른쪽 리스트에 있는 물품이 등록됩니다',
                icon: 'question',
                width: 'max-content',
                showCancelButton: true,
                confirmButtonText: '네, 최종 등록',
                cancelButtonText: '아니오, 계속 등록',
            })
            .then(async (e) => {
                if (e.isConfirmed) {
                    $.ajax({
                        url: '/item',
                        type: 'post', //데이터 전달방식
                        data: JSON.stringify(itemList),
                        dataType: 'json',
                        contentType: 'application/json',
                        xhr: () => {
                            let xhr = new XMLHttpRequest();
                            xhr.upload.addEventListener('progress', (e) => {
                                let percent = (e.loaded * 100) / e.total;
                                htSwal.fire({
                                    title: `물품을 등록 중입니다`,
                                    html: `잠시만 기다려 주십시오`,
                                    imageUrl: '/static/images/loader_Bagic.gif',
                                    imageWidth: 320,
                                    imageHeight: 320,
                                    imageAlt: 'Custom image',
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                });
                            });
                            return xhr;
                        },
                        success: function (res, jqxHR) {
                            if (res.ok === true) {
                                htSwal.fire('물품을 등록했습니다🎉', 'success');
                                setTimeout(() => (location.href = '/'), 1400);
                            } else if (res.duplicateList !== undefined) {
                                const workbook = utils.book_new();
                                let worksheet1 = undefined;
                                if (res.unDuplicateList.length < 1) {
                                    worksheet1 = utils.aoa_to_sheet([
                                        [
                                            '대분류',
                                            '소분류',
                                            '물품이름',
                                            '대여가능여부',
                                            '반환필요여부',
                                            '제품코드',
                                            '수량',
                                        ],
                                    ]);
                                } else {
                                    worksheet1 = utils.json_to_sheet(
                                        res.unDuplicateList
                                    );
                                }
                                const worksheet2 = utils.json_to_sheet(
                                    res.duplicateList
                                );
                                utils.book_append_sheet(
                                    workbook,
                                    worksheet1,
                                    '허용물품'
                                );
                                utils.book_append_sheet(
                                    workbook,
                                    worksheet2,
                                    '거부물품(중복)'
                                );
                                writeFileXLSX(
                                    workbook,
                                    '물품등록_수정요청.xlsx'
                                );
                                htSwal.fire({
                                    title: res.message,
                                    html:
                                        '중복이 발생한 물품코드 목록 엑셀파일이 다운로드됩니다</br>' +
                                        '<span style="color:red;">엑셀을 확인하고 중복된 물품을 제거하여 등록해주십시오</span></br>' +
                                        '"허용물품"시트를 수정하여 다시 파일을 올리거나 왼쪽 물품 등록 양식에서 물품을 올려주십시오',
                                    width: 'max-content',
                                    icon: 'error',
                                });
                            }
                        },
                        error: function (error) {
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
                                console.log(error);
                                htSwal.fire(
                                    `'${error.responseJSON.message}'`,
                                    '',
                                    'error'
                                );
                            }
                        },
                    }); //end of ajax
                }
            }); //end of htSwal.fire-popup
    } else {
        htSwal.fire('물품을 하나도 올리지 않으셨습니다', '', 'error');
    }
};
const getXlsxFormClick = (e) => {
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet([
        [
            '대분류',
            '소분류',
            '물품이름',
            '대여가능여부',
            '반환필요여부',
            '제품코드',
            '수량',
        ],
    ]);
    utils.book_append_sheet(workbook, worksheet, '물품목록');
    writeFileXLSX(workbook, '물품목록등록_서식.xlsx');
};

async function main() {
    juiGridXtable();
    if (localStoreItemList) itemList = localStoreItemList;
    await itemCategoryRender();
    itemDom.itemIdInput.addEventListener('focusout', itemVali.itemIdRegChk);
    itemDom.itemInsertFormBtn.addEventListener('click', itemInsertFormClick);
    itemDom.itemFormResetBtn.addEventListener('click', itemFormResetBtnClick);
    itemDom.itemListSave.addEventListener('click', itemListSaveClick);
    itemDom.itemListResetBtn.addEventListener('click', itemListResetBtnClick);
    itemDom.getXlsxForm.addEventListener('click', getXlsxFormClick);
    itemDom.itemInsertCancel.addEventListener('click', itemInsertCancelClick);
    itemDom.itemInsertSubmit.addEventListener('click', itemInsertSubmitClick);

    itemDom.itemCategoryLargeAddInsert.addEventListener(
        'click',
        itemCategoryLargeAddEvent.itemCategoryLargeAddSelect
    );
    itemDom.itemCategorySmallAddInsert.addEventListener(
        'click',
        itemCategorySmallAddEvent.itemCategorySmallAddSelect
    );
}
main();
