import customUtill from '../custom-utill.js';
import {itemDto} from './model/item-dto.js';

itemDto.itemId = 'A232323';
itemDto.itemCategory.large = '전자제품';
itemDto.itemCategory.small = '모니터';
itemDto.itemIsNeedRent = '대여 가능';
itemDto.itemIsNeedReturn = '반납 불필요';

/* ==============================*/
/* ==========  JUI 실행 ==========*/
/* ==============================*/
jui.ready(['ui.dropdown', 'grid.table'], function (dropdown, table) {
    table_9 = table('#table_9', {
        fields: [
            null,
            'itemId',
            'itemCategoryLarge',
            'itemCategorySmall',
            'itemIsNeedRent',
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
                this.select(row.index);
            },
        },
    });
});

jui.ready(['ui.paging'], function (paging) {
    paging_1 = paging('#paging_1', {
        count: 1000,
        pageCount: 10,
        screenCount: 7,
        event: {
            page: function (pNo) {
                alert(pNo);
            },
        },
    });
});
/* ==============================*/
/* ======  end of JUI 실행 ======*/
/* ==============================*/

function main() {
    customUtill.postRefresh();
}
main();
