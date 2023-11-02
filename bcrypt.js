const bcrypt = require("bcrypt");
const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);

console.log("salt: ", salt);

const myPlainPassword = "plainPassword";

const myOtherPassword = "doesNotMatch";

const hash = bcrypt.hashSync(myPlainPassword, salt);

console.log("hash: ", hash);

const isMatch = bcrypt.compareSync(myPlainPassword, hash);

console.log("isMatch with correct password? ", isMatch);

const isNotMatch = bcrypt.compareSync(myOtherPassword, hash);

console.log("isNotMatch with correct password? ", isNotMatch);
