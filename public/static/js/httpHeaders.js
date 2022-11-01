const token = localStorage.getItem('accessToken');

/**
 * deprecated
 */
const httpHeaders = {
    Authorization : {
        key : "Authorization",
        value : `Bearer ${token}`
    },
}

export default httpHeaders;