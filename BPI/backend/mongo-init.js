const { 
    DB_NAME, 
    DB_USER_NAME, 
    DB_USER_PASSWORD, 
    EXPRESS_USER_NAME,
    EXPRESS_USER_PASSWORD,
} = process.env;

db.createUser(
    {
        user: DB_USER_NAME,
        pwd: DB_USER_PASSWORD,
        roles: [
            {
            role: 'readWrite',
            db: DB_NAME,
            },
        ],
    }
);

db.getSiblingDB(DB_NAME);