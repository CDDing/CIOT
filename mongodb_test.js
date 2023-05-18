const { MongoClient } = require('mongodb');

const userid = "taptorestart";
const mongo_pass = "2018";
const mongo_address = "13.236.207.60:27017";

//const uri = 'mongodb://taptorestart:2018@13.236.207.60:27017'; // MongoDB 서버의 URI에 인증 정보 포함
const uri = 'mongodb://' + userid + ':' + mongo_pass + '@' + mongo_address;
const client = new MongoClient(uri);

// 문서 삽입
async function createDocument(hco, document) {
    const result = await hco.insertOne(document);
    console.log('Inserted document:', result.insertedId);
}

// 문서 조회
async function readDocuments(hco, query) {
    const documents = await hco.find(query).toArray();
    console.log('Found documents:', documents);
}

// 문서 업데이트
async function updateDocument(hco, filter, update) {
    const updateResult = await hco.updateOne(filter, update);
    console.log('Modified documents:', updateResult.modifiedCount);
}

// 문서 삭제
async function deleteDocument(hco, deleteFilter) {
    const deleteResult = await hco.deleteOne(deleteFilter);
    console.log('Deleted documents:', deleteResult.deletedCount);
}

async function mongo_session(command = 'no', db_name = 'admin', collection_name = 'te', data = { }, chdata = { }) {
    try {
        await client.connect(); // MongoDB 서버에 연결
        console.log('Connected to MongoDB');
        
        // 데이터베이스와 컬렉션 선택
        const database = client.db(db_name);
        const collection = database.collection(collection_name);

        /////////////////////////////////////////////////

        switch(command) {
            case 1:
            case 'create':
                //await createDocument(collection, { name: 'John', age: 30 });
                await createDocument(collection, data);
                break;
            case 2:
            case 'read':
                //await readDocuments(collection, { name: 'John' });
                await readDocuments(collection, data);
                break;
            case 3:
            case 'update':
                //await updateDocument(collection, { name: 'John' }, { $set: { age: 35 } });
                await updateDocument(collection, data, chdata);
                break;
            case 4:
            case 'delete':
                //await deleteDocument(collection, { name: 'John' });
                await deleteDocument(collection, data);
                break;
            default:
                console.log('Invalid Command');
                break;
        }

        /////////////////////////////////////////////////

        await client.close();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

//mongo_session('read', undefined, 'te', { name: 'John', age: 30 });
mongo_session('read', 'admin', 'te', { name: 'John', age: 30 });
//mongo_session('update', 'admin', 'te', { name: 'John', age: 30 }, { $set: { age: 35 } });