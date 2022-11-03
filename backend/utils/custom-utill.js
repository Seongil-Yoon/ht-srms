import _ from 'lodash';

const customUtill = {
    getKeyByValue: (object, value) => {
        console.log('object : ', object);
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
};
export default customUtill;
