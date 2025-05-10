import jwt from 'jsonwebtoken';

const token = jwt.sign({ username: 'haikal' }, 'a2NSADJK212ankja924jks');
console.log(token);