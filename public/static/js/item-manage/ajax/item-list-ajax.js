import htSwal from "../../custom-swal.js";

const getItemList = ({
    pageNum,
    itemIsCanRent,
    itemCategoryLarge,
    itemCategorySmall,
    itemSearchSelect,
    itemSearchInput,
    itemSortSelect,
    itemOrberBySelect,
}) => {
    try {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `/items?pageNum=${pageNum}&itemIsCanRent=${itemIsCanRent}&itemCategoryLarge=${itemCategoryLarge}&itemCategorySmall=${itemCategorySmall}&itemSearchSelect=${itemSearchSelect}&itemSearchInput=${itemSearchInput}&itemSortSelect=${itemSortSelect}&itemOrberBySelect=${itemOrberBySelect}`,
                type: 'get',
                dataType: 'json', //json 으로 받기
                success: function (result, jqxHr) {
                    resolve(result);
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
                        htSwal.fire('서버 오류 관리자에게 문의 하세요', '', 'error');
                    } else {
                        // htSwal.fire(`${error.message}`, '', 'error');
                    }
                    reject(error);
                },
            }); //end of ajax
        });
    } catch (error) {
        console.log(error);
    }
};

export default getItemList;
