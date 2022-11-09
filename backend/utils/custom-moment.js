import moment from 'moment';

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
/**
 * @deprecated : 클라이언트의 luxon라이브러리로 타임존변경 구현
 */
const customMoment = {
    asiaSeoulTimeNow: () => {
        return Date.now() + KR_TIME_DIFF;
    },
    getCurrentTime: () => {
        // moment().tz.setDefault("America/New_York");
        return moment().format('YYYY-MM-DD HH:mm:ss');
    },
};

export default customMoment;
