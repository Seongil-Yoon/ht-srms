import customUtill from '../custom-utill.js';
import {itemDto} from './model/item-dto.js';
import {itemCategoryRender} from './item-category-event.js';
import getItemList from './ajax/item-list-ajax.js';
import PagingFooterBar from '../paging-util.js';
import {DateTime} from '../../libs/luxon.min.js';
import ItemModifyEvent from './item-modify-script.js';
import ItemDeleteEvent from './item-delete-script.js';
import ItemRentEvent from './item-rent-script.js';

let table_9, paging_1, dd_3;
let itemListDate = [];
let pageNumClickRender = undefined;
const position = {
    pageX: 0,
    pageY: 0,
};
const itemfilterAndOrderByMap = {
    pageNum: 1,
    itemIsCanRent: 'any',
    itemCategoryLarge: '',
    itemCategorySmall: '',
    itemSearchSelect: '',
    itemSearchInput: '',
    itemSortSelect: '',
    itemOrberBySelect: -1,
};
/* ==============================*/
/* ==========  JUI 실행 ==========*/
/* ==============================*/
$(document).on('mousemove', function (event) {
    position.pageX = event.pageX;
    position.pageY = event.pageY;
});
const juiTableColums = [
    'itemNum',
    'itemId',
    'itemCategoryLarge',
    'itemCategorySmall',
    'itemName',
    'itemIsCanRent',
    'itemIsNeedReturn',
    'itemCanRentAmount',
    'itemRentingAmount',
    'itemTotalAmount',
    'showUpdatedAt',
    'updatedAt',
];
const juiGridTable = (items) => {
    const newItemDto = itemDto;
    let selectRowIndex = 0;
    jui.ready(['ui.dropdown', 'grid.table'], function (dropdown, table) {
        let rows = [];
        const insertItems = (items) => {
            items.forEach((e) => {
                rows.push({
                    itemNum: e.itemNum,
                    itemId: e.itemId,
                    itemCategoryLarge: e.itemCategory.large,
                    itemCategorySmall: e.itemCategory.small,
                    itemName: e.itemName,
                    itemIsCanRent: e.itemIsCanRent,
                    itemIsNeedReturn: e.itemIsNeedReturn,
                    itemCanRentAmount: e.itemCanRentAmount,
                    itemRentingAmount: e.itemRentingAmount,
                    itemTotalAmount: e.itemTotalAmount,
                    showUpdatedAt: DateTime.fromISO(e.updatedAt)
                        .setZone('Asia/Seoul')
                        .toLocaleString(DateTime.DATETIME_SHORT),
                    updatedAt: e.updatedAt,
                });
            });
            return rows;
        };
        let dd = dropdown('#table_9_dd', {
            event: {
                change: async function (data, e) {
                    let result;
                    switch (data.value) {
                        case 'rent':
                            if (
                                newItemDto.itemIsCanRent == true &&
                                newItemDto.itemCanRentAmount > 0
                            ) {
                                await ItemRentEvent.main(
                                    newItemDto,
                                    dd,
                                    table_9
                                );
                            } else {
                                swal(
                                    '해당 물품은 현재 대여불가능 합니다',
                                    '',
                                    'error'
                                );
                            }
                            break;
                        case 'rentHistory':
                            break;
                        case 'modifyItem':
                            let child = document.querySelector('tr.selected');
                            let parent = child.parentNode;
                            result = await ItemModifyEvent.main(
                                newItemDto,
                                dd,
                                table_9
                            );
                            await pageNumClickRender(itemfilterAndOrderByMap);
                            let changedIndex = Array.prototype.findIndex.call(
                                parent.children,
                                (c) =>
                                    c.getAttribute('data-value') ===
                                    child.getAttribute('data-value')
                            );
                            table_9.select(changedIndex);
                            break;
                        case 'deleteItem':
                            result = await ItemDeleteEvent.main(
                                newItemDto,
                                dd,
                                table_9
                            );
                            await pageNumClickRender(itemfilterAndOrderByMap);
                            break;
                        case 'renterList':
                            break;

                        default:
                            dd.hide();
                            table_9.unselect();
                            break;
                    }
                },
            },
        });
        table_9 = table('#table_9', {
            fields: juiTableColums,
            csv: juiTableColums,
            csvNames: juiTableColums,
            data: insertItems(items),
            editRow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            colshow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            editEvent: false,
            resize: true,
            sort: true,
            event: {
                rowmenu: function (row, e) {
                    newItemDto.itemNum = row.data.itemNum;
                    newItemDto.itemId = row.data.itemId;
                    newItemDto.itemCategory.large = row.data.itemCategoryLarge;
                    newItemDto.itemCategory.small = row.data.itemCategorySmall;
                    newItemDto.itemName = row.data.itemName;
                    newItemDto.itemIsCanRent = row.data.itemIsCanRent;
                    newItemDto.itemIsNeedReturn = row.data.itemIsNeedReturn;
                    newItemDto.itemCanRentAmount = row.data.itemCanRentAmount;
                    newItemDto.itemRentingAmount = row.data.itemRentingAmount;
                    newItemDto.itemTotalAmount = row.data.itemTotalAmount;
                    // newItemDto.updatedAt = row.data.updatedAt; => 백엔드에서 수정

                    selectRowIndex = row.index;
                    this.select(selectRowIndex);
                    dd.move(position.pageX, position.pageY);
                    dd.show();
                },
                click: (e) => {
                    table_9.unselect();
                },
                sort: function (column, e) {
                    let className = {
                        desc: 'icon-arrow1',
                        asc: 'icon-arrow3',
                    }[column.order];

                    $(column.element).children('i').remove();
                    $(column.element).append(
                        "<i class='" + className + "'></i>"
                    );
                    $('#exportfile').attr('href', this.getCsvBase64());
                    itemfilterAndOrderByMap[column.name] = column.order;
                    console.log(itemfilterAndOrderByMap);
                },
            },
        });
        table_9.update(rows);

        $('#exportfile').attr('href', table_9.getCsvBase64());
    });
};
/* ==============================*/
/* ======  end of JUI 실행 ======*/
/* ==============================*/
const itemfilterAndSortSelect = () => {
    try {
        $(".main select[name='itemIsCanRent']").on('change', (e) => {
            itemfilterAndOrderByMap.itemIsCanRent = e.target.value;
            itemfilterAndOrderByMap.pageNum = 1;
            pageNumClickRender(itemfilterAndOrderByMap);
        });
        $(".main select[name='itemCategoryLarge']").on('change', (e) => {
            itemfilterAndOrderByMap.itemCategoryLarge = e.target.value;
            itemfilterAndOrderByMap.itemCategorySmall = '';
            itemfilterAndOrderByMap.pageNum = 1;
            pageNumClickRender(itemfilterAndOrderByMap);
        });
        $(".main select[name='itemCategorySmall']").on('change', (e) => {
            itemfilterAndOrderByMap.itemCategorySmall = e.target.value;
            itemfilterAndOrderByMap.pageNum = 1;

            pageNumClickRender(itemfilterAndOrderByMap);
        });
        $(".main select[name='itemSearchSelect']").on('change', (e) => {
            itemfilterAndOrderByMap.itemSearchSelect = e.target.value;
        });
        $(".main label[id='itemSearchNameBtn']").on('click', (e) => {
            e.stopPropagation();
            itemfilterAndOrderByMap.itemSearchInput =
                e.target.previousSibling.previousSibling.value;
            itemfilterAndOrderByMap.pageNum = 1;

            pageNumClickRender(itemfilterAndOrderByMap);
        });
        $(".main select[name='itemOrberBySelect']").on('change', (e) => {
            itemfilterAndOrderByMap.itemOrberBySelect = e.target.value;
            itemfilterAndOrderByMap.pageNum = 1;
            pageNumClickRender(itemfilterAndOrderByMap);
        });
        $(".main select[name='itemSortSelect']").on('change', (e) => {
            itemfilterAndOrderByMap.itemSortSelect = e.target.value;
            itemfilterAndOrderByMap.pageNum = 1;
            pageNumClickRender(itemfilterAndOrderByMap);
        });
    } catch (error) {
        console.log(error);
    }
};

async function main() {
    await itemCategoryRender();
    itemfilterAndSortSelect();

    const pagingFooterBar1 = new PagingFooterBar();
    pageNumClickRender = async ({
        pageNum,
        itemIsCanRent,
        itemCategoryLarge,
        itemCategorySmall,
        itemSearchSelect,
        itemSearchInput,
        itemSortSelect,
        itemOrberBySelect,
    }) => {
        itemfilterAndOrderByMap.pageNum = pageNum;
        itemListDate = [];
        if (pageNum !== null) {
            itemListDate = await getItemList({
                pageNum,
                itemIsCanRent,
                itemCategoryLarge,
                itemCategorySmall,
                itemSearchSelect,
                itemSearchInput,
                itemSortSelect,
                itemOrberBySelect,
            });
            itemListDate.items = itemListDate.items || [];

            juiGridTable(itemListDate.items);
            pagingFooterBar1.createPageNum(itemListDate.pageInfo);
        }
    };
    pageNumClickRender(itemfilterAndOrderByMap);

    pagingFooterBar1.prevBtn.addEventListener('click', (e) => {
        itemfilterAndOrderByMap.pageNum = e.target.getAttribute('data-value');
        pageNumClickRender(itemfilterAndOrderByMap);
    });
    pagingFooterBar1.pageNumList.addEventListener('click', (e) => {
        itemfilterAndOrderByMap.pageNum = e.target.getAttribute('data-value');
        pageNumClickRender(itemfilterAndOrderByMap);
    });
    pagingFooterBar1.nextBtn.addEventListener('click', (e) => {
        itemfilterAndOrderByMap.pageNum = e.target.getAttribute('data-value');
        pageNumClickRender(itemfilterAndOrderByMap);
    });
}
main();
