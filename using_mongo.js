const mf = require('./mongodb_function');
//mf.mongo_session

//mongo_session(command = 'no', db_name = 'admin', collection_name = 'te', data = { }, chdata = { });
//command = create, read, update, delete

const result1 = mf.mongo_session('create', undefined, undefined, {name: 'jong', age: 23});
console.log(result1); // 5
