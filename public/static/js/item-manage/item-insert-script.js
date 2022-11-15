import {dom as itemDom} from './dom/item-insert-dom.js';
import {
    itemCategoryLargeAddEvent,
    itemCategorySmallAddEvent,
    itemCategoryRender,
} from './item-category-event.js';
import {itemDto} from './model/item-dto.js';
import htSwal from '../custom-swal.js';

let table_16, xtable;
/* 등록리스트 csv파싱 데이터 */
let text,
    itemList = [];
let localStoreItemList = JSON.parse(localStorage.getItem('itemList'));
const itemListTableWrap = document.querySelector('#itemListTableWrap');
const itemIdReg = /^[A-Z]{2}[0-9]{14}$/;
// 제품코드(16) : 물품분류코드(String : 2), 도입년월(Number : 6), 동일물품수량(Number:4), 동일배치에서순번(Number:4)

const juiGridXtable = () => {
    jui.ready(['util.base', 'grid.xtable'], (_, xtableUI) => {
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
            csvNumber: [0, 1, 2, 3, 4, 5, 6],
            resize: true,
            sort: true,
            bufferCount: 40,
            scrollHeight: 350,
            data: itemList,
            event: {
                scroll: (e) => {
                    // console.log(e);
                },
            },
        });
        itemDom.table_16_btn.addEventListener('change', (e) => {
            const input = e.target.files[0];
            const reader = new FileReader();
            let tempData = [];
            //파일을 불러올때 실행
            reader.onload = (e) => {
                //CSV파일로부터 text추출
                text = e.target.result;

                //D3.js를 이용하여 파싱
                tempData = d3.csvParse(text);
                tempData.forEach((element) => {
                    itemList.push(element);
                });
                xtable.update(itemList);
            };
            //load the input file to the reader
            reader.readAsText(input);
        }); //end of addEventListener
    });
};
const itemInsertFormClick = (e) => {
    e.preventDefault();
    // itemDto.itemWriter = $("input[name='_id']").val();
    if ($('#js-itemCategoryLarge').val() === '') {
        htSwal.fire('대분류를 선택해주십시오', '', 'error');
    } else if ($('#js-itemCategorySmall').val() === '') {
        htSwal.fire('소분류를 선택해주십시오', '', 'error');
    } else if ($("input[name='itemName']").val() === '') {
        htSwal.fire('물품 이름을 입력해주십시오', '', 'error');
    } else if (!itemIdReg.test($("input[name='itemId']").val())) {
        htSwal.fire(
            '제품코드 규칙을 지켜주십시오',
            'ex)CO20220600040001(분류(2:A)+도입일(4:N)+수량(4:N)+순번(4:N))',
            'error'
        );
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

        itemList.unshift({
            itemCategoryLarge: itemDto.itemCategory.large,
            itemCategorySmall: itemDto.itemCategory.small,
            itemName: itemDto.itemName,
            itemIsCanRent: itemDto.itemIsCanRent,
            itemIsNeedReturn: itemDto.itemIsNeedReturn,
            itemId: itemDto.itemId,
            itemTotalAmount: itemDto.itemTotalAmount,
        });
        xtable.update(itemList);
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
            .then((e) => {
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
                                });
                            });
                            return xhr;
                        },
                        success: function (result, jqxHR) {
                            if (result.ok === true) {
                                htSwal.fire('물품을 등록했습니다🎉', 'success');
                                setTimeout(() => (location.href = '/'), 1400);
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
                                htSwal.fire(`'${error.message}'`, '', 'error');
                            }
                        },
                    }); //end of ajax
                }
            }); //end of htSwal.fire-popup
    } else {
        htSwal.fire('물품을 하나도 올리지 않으셨습니다', '', 'error');
    }
};

async function main() {
    juiGridXtable();
    if (localStoreItemList) itemList = localStoreItemList;
    await itemCategoryRender();
    itemDom.itemInsertFormBtn.addEventListener('click', itemInsertFormClick);
    itemDom.itemFormResetBtn.addEventListener('click', itemFormResetBtnClick);
    itemDom.itemListSave.addEventListener('click', itemListSaveClick);
    itemDom.itemListResetBtn.addEventListener('click', itemListResetBtnClick);
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
