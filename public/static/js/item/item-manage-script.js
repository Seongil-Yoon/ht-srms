import customUtill from '../custom-utill.js';
import {itemDto} from './model/item-dto.js';
let table_9, paging_1;

itemDto.itemId = 'A232323';
itemDto.itemCategory.large = '전자제품';
itemDto.itemCategory.small = '모니터';
itemDto.itemIsCanRent = '대여 가능';
itemDto.itemIsNeedReturn = '반납 불필요';
const itemRowDate = [];
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
            null,
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
        data: [
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
            {
                itemId: 'A000001',
                itemCategoryLarge: '전자제품',
                itemCategorySmall: '모니터',
                itemName: 'DELL 24인치 모니터',
                itemIsCanRent: true,
                itemIsNeedReturn: true,
                itemCanRentAmount: 8,
                itemRentingAmount: 2,
                itemTotalAmount: 10,
                updatedAt: '2022-11-03 22:00:00',
            },
        ],
        editRow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        editEvent: false,
        event: {
            rowmenu: function (row, e) {
                let pos = $(e.target).position();
                this.select(row.index);
                dd.move(position.pageX, position.pageY);
                dd.show();
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

function main() {}
main();
