import {dom as itemDom} from './dom/item-modify-dom.js';
import {itemDto} from './model/item-dto.js';
import htSwal from '../custom-swal.js';

let itemCategoryList = [];
let targetItem = undefined;

const smallRender = () => {
    $('#js-itemCategorySmallModify').empty();
    let largeCategory = $('#js-itemCategoryLargeModify')
        .children('option:selected')
        .attr('value');
    let findSmall = itemCategoryList.filter((e) => {
        if (e.itemCategory.large === largeCategory) {
            return true;
        }
    });
    let html = '';
    findSmall[0].itemCategory.small.forEach((e) => {
        if (e !== targetItem.itemCategory.small)
            html += `<option value='${e}'>${e}</option>`;
        else html += `<option value='${e}' selected>${e}</option>`;
    });
    $('#js-itemCategorySmallModify').append(html);
};
const itemModifyCategoryRender = async (item) => {
    targetItem = targetItem || item;
    const ajax = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/item-manage-page/category',
                type: 'get',
                dataType: 'json',
                success: (result, jqxHR) => {
                    if (result.length > 0) {
                        itemCategoryList = result;
                        resolve(itemCategoryList);
                    } else {
                        itemCategoryList = [
                            {
                                itemCategory: {
                                    large: '대분류',
                                    small: ['소분류'],
                                },
                            },
                        ];
                        resolve(itemCategoryList);
                    }
                },
                error: function (error) {
                    //서버오류 500, 찾는 자료없음 404, 권한없음 403, 인증실패 401
                    if (error.status == 404) {
                        htSwal.fire('찾는 자료가 없습니다', '', 'error');
                    } else if (error.status == 401) {
                        htSwal.fire('유효하지 않은 인증입니다', '', 'error');
                    } else if (error.status == 403) {
                        htSwal.fire('접근 권한이 없습니다', '', 'error');
                    } else if (error.status == 500) {
                        htSwal.fire(
                            '서버 오류 관리자에게 문의 하세요',
                            '',
                            'error'
                        );
                    } else {
                        htSwal.fire(`${error.responseJSON.message}`, '', 'error');
                    }
                },
            }); //end of ajax
        });
    };

    const render = async (itemCategoryList) => {
        $('#js-itemCategoryLargeModify').empty();
        // call by value
        let html = '';
        itemCategoryList.forEach((e) => {
            if (e.itemCategory.large !== targetItem.itemCategory.large)
                html += `<option value='${e.itemCategory.large}'>${e.itemCategory.large}</option>`;
            else
                html += `<option value='${e.itemCategory.large}' selected>${e.itemCategory.large}</option>`;
        });
        $('#js-itemCategoryLargeModify').append(html);
    };
    await render(await ajax());

    smallRender();
    $('#js-itemCategoryLargeModify').on('change', () => {
        smallRender();
    });
};

const itemModifyCategoryLargeAddEvent = {
    itemCategoryLargeAddSelect: (e) => {
        let html = `
        <td>
            <input type="text" id="js-itemCategoryLargeModify" class="item-category-large" name="itemCategoryLarge" placeholder="대분류를 입력해주세요">
            <button type="button" for="js-itemCategoryLargeModify" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategoryLargeModifyAddSelect" value="insert">대분류 선택</button>
        </td>
        `;
        itemDom.itemCategoryLargeGroup.insertAdjacentHTML('beforeend', html);
        e.target.parentNode.remove();
        itemDom.itemCategoryLargeModifyAddSelect = document.querySelector(
            '#js-itemCategoryLargeModifyAddSelect'
        );
        itemDom.itemCategoryLargeModifyAddSelect.addEventListener(
            'click',
            itemModifyCategoryLargeAddEvent.itemCategoryLargeAddInsert
        );
    },

    itemCategoryLargeAddInsert: (e) => {
        let html = `
        <td>
            <select class="item-category-large" id="js-itemCategoryLargeModify" name="itemCategoryLarge"></select>
            <button type="button" for="js-itemCategoryLargeModify" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategoryLargeModifyAddInsert">대분류 추가</button>
        </td>
        `;
        itemDom.itemCategoryLargeGroup.insertAdjacentHTML('beforeend', html);
        itemModifyCategoryRender();
        e.target.parentNode.remove();
        itemDom.itemCategoryLargeModifyAddInsert = document.querySelector(
            '#js-itemCategoryLargeModifyAddInsert'
        );
        itemDom.itemCategoryLargeModifyAddInsert.addEventListener(
            'click',
            itemModifyCategoryLargeAddEvent.itemCategoryLargeAddSelect
        );
    },
};

const itemModifyCategorySmallAddEvent = {
    itemCategorySmallAddSelect: (e) => {
        let html = `
        <td>
            <input type="text" id="js-itemCategorySmallModify" class="item-category-small" name="itemCategorySmall" placeholder="소분류를 입력해주세요">
            <button type="button" for="js-itemCategorySmallModify" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategorySmallModifyAddSelect">소분류 선택</button>
        </td>
        `;
        itemDom.itemCategorySmallGroup.insertAdjacentHTML('beforeend', html);
        e.target.parentNode.remove();
        itemDom.itemCategorySmallModifyAddSelect = document.querySelector(
            '#js-itemCategorySmallModifyAddSelect'
        );
        itemDom.itemCategorySmallModifyAddSelect.addEventListener(
            'click',
            itemModifyCategorySmallAddEvent.itemCategorySmallAddInsert
        );
    },
    itemCategorySmallAddInsert: (e) => {
        let html = `
        <td>
            <select class="item-category-small" id="js-itemCategorySmallModify" name="itemCategorySmall"></select>
            <button type="button" for="js-itemCategorySmallModify" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategorySmallModifyAddInsert">소분류 추가</button>
        </td>
        `;
        itemDom.itemCategorySmallGroup.insertAdjacentHTML('beforeend', html);
        itemModifyCategoryRender();
        e.target.parentNode.remove();
        itemDom.itemCategorySmallModifyAddInsert = document.querySelector(
            '#js-itemCategorySmallModifyAddInsert'
        );
        itemDom.itemCategorySmallModifyAddInsert.addEventListener(
            'click',
            itemModifyCategorySmallAddEvent.itemCategorySmallAddSelect
        );
    },
};

export {
    itemModifyCategoryLargeAddEvent,
    itemModifyCategorySmallAddEvent,
    itemModifyCategoryRender,
};
