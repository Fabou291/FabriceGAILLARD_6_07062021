const getAll = (req, res, next) => {
    res.end("getAll functionnality");
};

const getOne = (req, res, next) => {
    res.end("getOne functionnality");
};

const create = (req, res, next) => {
    res.end("create functionnality");
};

const modify = (req, res, next) => {
    res.end("modify functionnality");
};

const remove = (req, res, next) => {
    res.end("remove functionnality");
};

const handleLike = (req, res, next) => {
    res.end("handleLike functionnality");
};

export default { getAll, getOne, create, modify, remove, handleLike };
