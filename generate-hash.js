const bcrypt = require('bcryptjs');

const password = 'admin123'; // cámbiala por la que quieras
const hash = bcrypt.hashSync(password, 10);
console.log(hash);