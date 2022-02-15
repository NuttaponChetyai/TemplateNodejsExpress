let COMMANDNAME = Object.freeze({

    LOGIN: "login"
});

const LISTAPI = [
    {
        API: '/api/v1/auth/login',
        COMMANDNAME: COMMANDNAME.LOGIN,
        METHODS: 'POST'
    }
];

module.exports.checkCommandName = (path, methods) => {
    let command = LISTAPI.find(api => api.API === path && api.methods === methods);
    if (command == undefined) return 'undefined';
    else return command.COMMANDNAME;
};
















