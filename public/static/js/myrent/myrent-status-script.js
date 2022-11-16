import {DateTime} from '../../libs/luxon.min.js';
import htSwal from '../custom-swal.js';
import customUtill from '../custom-utill.js';
import {itemDto} from '../item-manage/model/item-dto.js';
import {rentDto} from '../item-manage/model/rent-dto.js';
import PagingFooterBar from '../paging-util.js';
import getRentListByUser from './myrent-get-rent-list.js';

let table_9, paging_1, dd_3;
let rentListByUser = [];
let pageNumClickRender = undefined;
let pageNum = 1;
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
const juiTableColums = [
    '_id',
    'rentNum',
    'itemId',
    'itemCategoryLarge',
    'itemCategorySmall',
    'itemName',
    'rentPurpose',
    'showRentAt',
    'showrExpectReturnAt',
    'isExpire',
    'rentAt',
    'expectReturnAt',
];
const juiGridTable = (rents) => {
    const newItemDto = itemDto;
    let selectRowIndex = 0;
    jui.ready(['ui.dropdown', 'grid.table'], function (dropdown, table) {
        let rows = [];
        const insertRents = (rents) => {
            rents.forEach((e) => {
                rows.push({
                    _id: e._id,
                    rentNum: e.rentNum,
                    itemId: e.rentedItem.itemId,
                    itemCategoryLarge: e.rentedItem.itemCategory.large,
                    itemCategorySmall: e.rentedItem.itemCategory.small,
                    itemName: e.rentedItem.itemName,
                    rentPurpose: e.rentPurpose,
                    showRentAt: ((rentAt) => {
                        if (rentAt === null) return '반납할 필요가 없습니다';
                        else
                            return DateTime.fromISO(rentAt)
                                .setZone('Asia/Seoul')
                                .toLocaleString(DateTime.DATETIME_SHORT);
                    })(e.rentAt),
                    showrExpectReturnAt: ((expectReturnAt) => {
                        if (expectReturnAt === null)
                            return '반납할 필요가 없습니다';
                        else
                            return DateTime.fromISO(expectReturnAt)
                                .setZone('Asia/Seoul')
                                .toLocaleString(DateTime.DATETIME_SHORT);
                    })(e.expectReturnAt),
                    rentAt: e.rentAt,
                    expectReturnAt: e.expectReturnAt,
                    isExpire: e.isExpire,
                });
            });
            return rows;
        };
        let dd = dropdown('#table_9_dd', {
            event: {
                change: async function (data, e) {
                    let result;
                },
            },
        });
        table_9 = table('#table_9', {
            fields: juiTableColums,
            csv: juiTableColums,
            csvNames: juiTableColums,
            data: insertRents(rents),
            colshow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            editEvent: false,
            resize: true,
            sort: true,
            event: {
                rowmenu: function (row, e) {
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
                },
            },
        });
        table_9.update(rows);
    });
};
/* ==============================*/
/* ======  end of JUI 실행 ======*/
/* ==============================*/

async function main() {
    const pagingFooterBar1 = new PagingFooterBar();
    pageNumClickRender = async (pageNum) => {
        rentListByUser = [];
        if (pageNum !== null) {
            rentListByUser = await getRentListByUser(pageNum);
            rentListByUser.rents = rentListByUser.rents || [];

            juiGridTable(rentListByUser.rents);
            pagingFooterBar1.createPageNum(rentListByUser.pageInfo);
        }
    };
    pageNumClickRender(pageNum);
    pagingFooterBar1.prevBtn.addEventListener('click', (e) => {
        pageNum = e.target.getAttribute('data-value');
        pageNumClickRender(pageNum);
    });
    pagingFooterBar1.pageNumList.addEventListener('click', (e) => {
        pageNum = e.target.getAttribute('data-value');
        pageNumClickRender(pageNum);
    });
    pagingFooterBar1.nextBtn.addEventListener('click', (e) => {
        pageNum = e.target.getAttribute('data-value');
        pageNumClickRender(pageNum);
    });
}
main();
