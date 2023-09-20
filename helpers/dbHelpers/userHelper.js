const fs = require('fs');

const createUser = (user) => {
    const { username, password } = user;
    const newUser = {
        username,
        password,
    };
    return newUser;
}