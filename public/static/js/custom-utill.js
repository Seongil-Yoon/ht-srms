const customUtill = {
    getKeyByValue: (object, value) => {
        return Object.keys(object).find((key) => object[key] === value);
    },
    getValueByKey: (object, key) => {
        return object[key];
    },
    postRefresh: () => {
        $.ajax({
            url: '/refresh',
            type: 'post',
            success:  (result, jqxHR) => {
                console.log(result);
                return result;
            },
            error: (error) => {
                console.log(error);
                return error;
            },
        });
    },
};
export default customUtill;
