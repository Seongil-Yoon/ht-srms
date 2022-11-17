import htSwal from './custom-swal.js';
import {read, readFile, writeFileXLSX} from '../libs/xlsx.mjs';

const customUtill = {
    getKeyByValue: (object, value) => {
        return Object.keys(object).find((key) => object[key] === value);
    },
    getValueByKey: (object, key) => {
        return object[key];
    },
    /** return : keys[] */
    getValuesByKeys: (object, key) => {
        let keys = [];
        key.forEach((element) => {
            keys.push(object[element]);
        });
        return keys;
    },
    compareTwoObject: (oldData, newData) => {
        const data = uniq([...Object.keys(oldData), ...Object.keys(newData)]);

        for (const key of data) {
            if (!isEqual(oldData[key], newData[key])) {
                return key; //
            }
        }
        return null;
    },
    updateArray: (myArray, oldValue, newValue) => {
        if (!myArray instanceof Array) return;

        const index = myArray.indexOf(oldValue);
        if (index !== -1) {
            myArray[index] = newValue;
            return myArray;
        }
    },
    incrementString: (string) => {
        const findNum = string
            .split('')
            .findIndex((char) => !isNaN(Number(char)));

        if (findNum === -1) return string + '1';

        const nums = string.substring(findNum);

        const result = (Number(nums) + 1 + '').padStart(nums.length, '0');

        return string.substring(0, findNum) + result;
    },
    /**
     * @param : 배열의 요소들에 대해 차례대로 비동기 작업을 수행하는 것으로, 실행 순서가 보장되어야 할 때 사용한다.
     * @memo : 배열의 비동기 작업에 forEach를 사용하면 순차처리이든, 병렬처리이든 올바르게 작동하기 힘든 이유가 여기에 있다.
     * forEach는 콜백만 실행하고 끝나버리기에 비동기 작업의 처리 상태를 추적하지 못하고, 따라서 이후의 흐름을 제어하기도 어렵다.
     * 하지만 map과 promise.all을 사용하면 callback들이
     * return하는 promise 들을 새로운 배열에 잘 담아두었다가 모든 promise가 resolved되는 타이밍을 감지할 수 있다.
     * 따라서 배열의 요소들에 비동기 작업을 실시한 후 (순차든, 병렬이든),
     * 어떤 작업을 해야 한다면 forEach가 아닌 map과 Promise.all을 사용하는 것이 좋다.
     * 출처: https://velog.io/@hanameee/%EB%B0%B0%EC%97%B4%EC%97%90-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%9E%91%EC%97%85%EC%9D%84-%EC%8B%A4%EC%8B%9C%ED%95%A0-%EB%95%8C-%EC%95%8C%EC%95%84%EB%91%90%EB%A9%B4-%EC%A2%8B%EC%9D%84%EB%B2%95%ED%95%9C-%EC%9D%B4%EC%95%BC%EA%B8%B0%EB%93%A4
     */
    asyncForEach: async (array /* */, callback) => {
        for (let index = 0; index < array.length; index++) {
            const result = await callback(array[index], index, array);
        }
    },
    checkFileName: (str, allow /* array */) => {
        //1. 확장자 체크
        let ext = str.split('.').pop().toLowerCase();
        if ($.inArray(ext, allow) == -1) {
            htSwal.fire({
                title: `${ext} 파일은 </br> 업로드 하실 수 없습니다`,
                icon: 'warning',
            });
            return ext;
        } else {
            return ext;
        }
    },
    /**
     * xlsx file to workBook
     */
    handleFileAsync: async (e) => {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        /* data is an ArrayBuffer */
        const workbook = read(data);
        return workbook;
    },
};
export default customUtill;
