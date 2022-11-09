class PagingFooterBar {
    pagingTableFooter;
    prevBtn;
    pageNumList;
    nextBtn;
    fragment;

    constructor() {
        this.pagingTableFooter = document.querySelector(
            '#js-pagingTableFooter'
        );
        this.prevBtn = this.pagingTableFooter.querySelector('#prevBtn');
        this.pageNumList = this.pagingTableFooter.querySelector('#pageNumList');
        this.nextBtn = this.pagingTableFooter.querySelector('#nextBtn');
    }
    /**
     * @param pageInfo : {
            "currentPage": 현재 페이지,
            "startPage": 시작 페이지,
            "endPage": 페이지푸터의 끝 페이지,
            "maxPost": 페이지당 최대 글,
            "totalPage": 총 페이지
        },
        @dom pagingTableFooter, prevBtn, pageNumList, nextBtn
        @return void
    */
    createPageNum({startPage, endPage, maxPost, totalPage, currentPage}) {
        try {
            this.fragment = document.createDocumentFragment();
            while (this.pageNumList.hasChildNodes()) {
                this.pageNumList.removeChild(this.pageNumList.firstChild);
            }

            if (startPage > maxPost) {
                // 이전 페이지 버튼 활성화
                this.prevBtn.setAttribute('data-value', startPage - 1);
            } else {
                this.prevBtn.innerHTML = '';
                this.prevBtn.setAttribute('style', 'background-image: url()');
            }

            let pageNumElement = undefined;
            for (let i = startPage; i <= endPage; i++) {
                pageNumElement = document.createElement('a');
                pageNumElement.setAttribute('name', 'pageNum');
                pageNumElement.setAttribute('data-value', i);
                pageNumElement.innerHTML = i;
                if (i === currentPage)
                    pageNumElement.setAttribute('class', 'active');
                this.fragment.appendChild(pageNumElement);
            }
            // fragment에 자식요소들을 넣었다가 한번에 부모요소에 append
            this.pageNumList.appendChild(this.fragment.cloneNode(true));

            if (endPage < totalPage) {
                // 다음 페이지 버튼 활성화
                this.nextBtn.setAttribute('data-value', endPage + 1);
            } else {
                this.nextBtn.innerHTML = '';
                this.nextBtn.setAttribute('style', 'background-image: url()');
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default PagingFooterBar;
