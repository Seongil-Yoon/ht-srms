import {
    itemDto
} from "./model/item-dto.js";
let table_16, xtable_3;
const table_16_btn = document.querySelector('#table_16_btn');
const itemListTableWrap = document.querySelector('#itemListTableWrap');

jui.ready(['grid.xtable'], function (xtable) {
    var page = 1;

    xtable_3 = xtable('#xtable_3', {
        fields: [
            'itemCategoryLarge',
            'itemCategorySmall',
            'itemName',
            'itemIsCanRent',
            'itemIsNeedReturn',
            'itemId',
            'itemTotalAmount',
        ],
        resize: true,
        sort: true,
        bufferCount: 40,
        scrollHeight: 350,
    });
    table_16_btn.addEventListener('change', (e) => {
        xtable_3.setCsvFile(e.target.files[0]);
    });
});

function main() {

}
main();