/**
 *  @param pageNum : 요청된 페이지
 *  @param totalPost : 총 다큐먼트(row)갯수
    @return pageInfo : {
        "startPage": 시작 페이지,
        "endPage": 페이지푸터의 끝 페이지,
        "hidePost" : 앞에서 제외할 다큐먼트(row)
        "currentPage": 현재 페이지,
        "maxPost": 페이지당 최대 글,
        "totalPage": 총 페이지
    }
 */
const paging = (pageNum, totalPost) => {
    const maxPost = 15;
    const maxPage = 10;
    let currentPage = pageNum ? parseInt(pageNum) : 1;
    const hidePost = pageNum === 1 ? 0 : (pageNum - 1) * maxPost; // 앞에서 제외할 다큐먼트(row)
    const totalPage = Math.ceil(totalPost / maxPost); // 한 화면에 나타날 페이지의 갯수

    if (currentPage > totalPage) {
        currentPage = totalPage;
    }

    const startPage = Math.floor((currentPage - 1) / maxPage) * maxPage + 1;
    let endPage = startPage + maxPage - 1;

    if (endPage > totalPage) {
        // 한 화면에서의 마지막 페이지가 totalPage보다 클때, 마지막 페이지번호까지
        endPage = totalPage;
    }

    return {
        startPage,
        endPage,
        hidePost,
        maxPost,
        totalPage,
        currentPage,
    };
};

export default paging;
