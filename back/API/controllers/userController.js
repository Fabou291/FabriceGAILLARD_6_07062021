const create = (req, res, next) => {
    res.end("create user functionnality");
};

const login = (req, res, next) => {
    res.end("login functionnality");
};

export default { create, login };
