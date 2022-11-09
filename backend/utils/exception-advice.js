const ExceptionAdvice = {
    item: (req, res, error, code) => {
        if (error.message === 'wrong query name') {
            res.status(400).json({
                ok: false,
                message: error.message,
                advice: 'query name : pageNum',
                detail: {
                    key: Object.keys(req.query),
                    keyAndValue: req.query,
                },
                items: [],
            });
        } else if (error.message === 'wrong value type') {
            res.status(400).json({
                ok: false,
                message: error.message,
                advice: 'value type : Number',
                detail: {
                    key: Object.keys(req.query),
                    keyAndValue: req.query,
                },
                items: [],
            });
        } else {
            res.status(404).json({
                ok: false,
                message: error.message,
                items: [],
            });
        }
    },
};

export default ExceptionAdvice;
