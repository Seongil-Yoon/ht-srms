import customUtill from '../custom-utill.js';
import {itemDto} from './model/item-dto.js';
import {itemCategoryRender} from './item-category-event.js';
import getItemList from './ajax/item-list-ajax.js';
import PagingFooterBar from '../paging-util.js';

let table_9, paging_1;
let itemListDate = [];
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
const juiGridTable = (items) => {
    jui.ready(['ui.dropdown', 'grid.table'], function (dropdown, table) {
        let dd = dropdown('#table_9_dd', {
            event: {
                change: function (data) {
                    alert(data.text);
                },
            },
        });
        table_9 = table('#table_9', {
            fields: [
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
                'updatedAt',
            ],
            data: [],
            editRow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            editEvent: false,
            event: {
                rowmenu: function (row, e) {
                    // let pos = $(e.target).position();
                    this.select(row.index);
                    dd.move(position.pageX, position.pageY);
                    dd.show();
                },
            },
        });
        (() => {
            table_9.reset();
            let rows = [];
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
                    updatedAt: e.updatedAt,
                });
            });

            table_9.insert(0, rows.reverse());
        })();
    });
};
/* ==============================*/
/* ======  end of JUI 실행 ======*/
/* ==============================*/

async function main() {
    itemCategoryRender();

    const pagingFooterBar1 = new PagingFooterBar();
    const pageNumClickRender = async (pageNum) => {
        itemListDate = await getItemList(pageNum);
        juiGridTable(itemListDate.items);
        pagingFooterBar1.createPageNum(itemListDate.pageInfo);
    };
    pageNumClickRender(1);

    pagingFooterBar1.prevBtn.addEventListener('click', (e) => {
        pageNumClickRender(e.target.getAttribute('data-value'));
    });
    pagingFooterBar1.pageNumList.addEventListener('click', (e) => {
        pageNumClickRender(e.target.getAttribute('data-value'));
    });
    pagingFooterBar1.nextBtn.addEventListener('click', (e) => {
        pageNumClickRender(e.target.getAttribute('data-value'));
    });
}
main();
