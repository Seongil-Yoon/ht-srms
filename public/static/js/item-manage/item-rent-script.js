import {dom as rentDom} from './dom/item-rent-dom.js';
import {itemDto} from './model/item-dto.js';
import {rentDto} from './model/rent-dto.js';
import {DateTime} from '../../libs/luxon.min.js';
// import flatpickr from '../../libs/flatpickr.min.js';

let newItemDto = itemDto;
let newRentDto = rentDto;
let newDropdown, newTable;

const showRentModal = (item) => {
    $('section.item-rent-modal-overlay').css('display', 'unset');
    rentDom.itemCategoryLargeRent.value = newItemDto.itemCategory.large;
    rentDom.itemCategorySmallRent.value = newItemDto.itemCategory.small;
    rentDom.itemNameRent.value = newItemDto.itemName;
    rentDom.itemIdRent.value = newItemDto.itemId;
};
const itemRentCancelClick = (e) => {
    e.preventDefault();
    swal({
        title: `대여를 취소하시겠습니까?`,
        text: '',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        buttons: ['닫기', '대여취소'],
    }).then((e) => {
        if (e) {
            $('section.item-rent-modal-overlay').css('display', 'none');
            newTable.unselect();
        }
    });
};
const ItemRentEvent = {
    main: async (targetItem, dropdown, table) => {
        newItemDto = targetItem;
        newDropdown = dropdown;
        newTable = table;
        showRentModal(newItemDto);
        return new Promise((resolve, reject) => {
            const itemRentSubmitClick = (e) => {
                e.preventDefault();
                newRentDto.rentedItem.itemNum = newItemDto.itemNum;
                newRentDto.rentedItem.itemId = newItemDto.itemId;
                newRentDto.rentedItem.itemName = newItemDto.itemName;
                newRentDto.rentedItem.itemCategory = newItemDto.itemCategory;
                newRentDto.rentPurpose = rentDom.rentPurpose.value;
                newRentDto.rentAt = rentDom.rentAt.value;
                newRentDto.expectReturnAt = rentDom.expectReturnAt.value;
            };

            rentDom.itemRentCancel.addEventListener(
                'click',
                itemRentCancelClick
            );
            rentDom.itemRentSubmit.addEventListener(
                'click',
                itemRentSubmitClick
            );
        });
    },
};
export default ItemRentEvent;
