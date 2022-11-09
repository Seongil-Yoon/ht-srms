import {dom as itemDom} from './dom/item-insert-dom.js';
import {itemDto} from './model/item-dto.js';
let itemCategoryList = [];

const smallRender = () => {
    $('#js-itemCategorySmall').empty();
    let largeCategory = $('#js-itemCategoryLarge')
        .children('option:selected')
        .attr('value');
    let findSmall = itemCategoryList.filter((e) => {
        if (e.itemCategory.large == largeCategory) {
            return true;
        }
    });
    let html = '';
    findSmall[0].itemCategory.small.forEach((e) => {
        html += `<option value='${e}'>${e}</option>`;
    });
    $('#js-itemCategorySmall').append(html);
};
const itemCategoryRender = async () => {
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
                    }
                },
                error: function (error) {
                    reject(error);
                    //서버오류 500, 찾는 자료없음 404, 권한없음 403, 인증실패 401
                    if (error.status == 404) {
                        swal('찾는 자료가 없습니다', '', 'error');
                    } else if (error.status == 401) {
                        swal('유효하지 않은 인증입니다', '', 'error');
                    } else if (error.status == 403) {
                        swal('접근 권한이 없습니다', '', 'error');
                    } else if (error.status == 500) {
                        swal('서버 오류 관리자에게 문의 하세요', '', 'error');
                    } else {
                        swal(`${error.message}`, '', 'error');
                    }
                },
            }); //end of ajax
        });
    };

    const render = async (itemCategoryList) => {
        // call by value
        let html = '';
        itemCategoryList.forEach((e) => {
            html += `<option value='${e.itemCategory.large}'>${e.itemCategory.large}</option>`;
        });
        $('#js-itemCategoryLarge').append(html);
    };
    await render(await ajax());

    smallRender();
    $('#js-itemCategoryLarge').on('change', () => {
        smallRender();
    });
};

const itemCategoryLargeAddEvent = {
    itemCategoryLargeAddSelect: (e) => {
        let html = `
        <div>
            <input type="text" id="js-itemCategoryLarge" class="item-category-large" name="itemCategoryLarge" placeholder="대분류를 입력해주세요">
            <button type="button" for="js-itemCategoryLarge" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategoryLargeAddSelect" value="insert">대분류 선택</button>
        </div>
        `;
        itemDom.itemCategoryLargeGroup.insertAdjacentHTML('beforeend', html);
        e.target.parentNode.remove();
        itemDom.itemCategoryLargeAddSelect = document.querySelector(
            '#js-itemCategoryLargeAddSelect'
        );
        itemDom.itemCategoryLargeAddSelect.addEventListener(
            'click',
            itemCategoryLargeAddEvent.itemCategoryLargeAddInsert
        );
    },

    itemCategoryLargeAddInsert: (e) => {
        let html = `
        <div>
            <select class="item-category-large" id="js-itemCategoryLarge" name="itemCategoryLarge"></select>
            <button type="button" for="js-itemCategoryLarge" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategoryLargeAddInsert">대분류 추가</button>
        </div>
        `;
        itemDom.itemCategoryLargeGroup.insertAdjacentHTML('beforeend', html);
        itemCategoryRender();
        e.target.parentNode.remove();
        itemDom.itemCategoryLargeAddInsert = document.querySelector(
            '#js-itemCategoryLargeAddInsert'
        );
        itemDom.itemCategoryLargeAddInsert.addEventListener(
            'click',
            itemCategoryLargeAddEvent.itemCategoryLargeAddSelect
        );
    },
};

const itemCategorySmallAddEvent = {
    itemCategorySmallAddSelect: (e) => {
        let html = `
        <div>
            <input type="text" id="js-itemCategorySmall" class="item-category-small" name="itemCategorySmall" placeholder="대분류를 입력해주세요">
            <button type="button" for="js-itemCategorySmall" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategorySmallAddSelect">소분류 선택</button>
        </div>
        `;
        itemDom.itemCategorySmallGroup.insertAdjacentHTML('beforeend', html);
        e.target.parentNode.remove();
        itemDom.itemCategorySmallAddSelect = document.querySelector(
            '#js-itemCategorySmallAddSelect'
        );
        itemDom.itemCategorySmallAddSelect.addEventListener(
            'click',
            itemCategorySmallAddEvent.itemCategorySmallAddInsert
        );
    },
    itemCategorySmallAddInsert: (e) => {
        let html = `
        <div>
            <select class="item-category-small" id="js-itemCategorySmall" name="itemCategorySmall"></select>
            <button type="button" for="js-itemCategorySmall" class="ht-btn btn-outline-primary btn-blue" id="js-itemCategorySmallAddInsert">대분류 추가</button>
        </div>
        `;
        itemDom.itemCategorySmallGroup.insertAdjacentHTML('beforeend', html);
        e.target.parentNode.remove();
        itemDom.itemCategorySmallAddInsert = document.querySelector(
            '#js-itemCategorySmallAddInsert'
        );
        itemDom.itemCategorySmallAddInsert.addEventListener(
            'click',
            itemCategorySmallAddEvent.itemCategorySmallAddSelect
        );
    },
};

export {
    itemCategoryLargeAddEvent,
    itemCategorySmallAddEvent,
    itemCategoryRender,
};
