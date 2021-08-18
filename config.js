import os from 'os';

const MONGODB_PATH = 'mongodb+srv://agrimatch:PVA4sQvSatW3Uwr@cluster0.xjjw5.mongodb.net/MyAgrimatch?retryWrites=true&w=majority';

const BASE_PATH = os.homedir() + '/AgriMatch/';

const PROPIC_URL = BASE_PATH + 'UserProPics/';

const GPA_CERT_URL = BASE_PATH + 'GpaCertPics/';

const JWT_KEY = "agrimatch_secure_key";


export default {
    MONGODB_PATH,
    PROPIC_URL,
    GPA_CERT_URL,
    JWT_KEY
}