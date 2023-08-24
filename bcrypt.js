const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const myPlainPassword = "superhardpassword";
const myOtherPassword = "notTheSamed";

const salt = bcrypt.genSaltSync(SALT_ROUNDS);

console.log("salt rounds: ", salt);

const hashedPassword = bcrypt.hashSync(myPlainPassword, salt);

console.log("hashed password: ", hashedPassword);

const isMatch = bcrypt.compareSync("superhardpassword", hashedPassword);

console.log("isMatch? ", isMatch);
