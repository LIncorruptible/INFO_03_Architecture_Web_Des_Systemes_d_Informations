db.createUser(
    {
        user: "administrateur",
        pwd: "administrateur",
        roles: [
            {
                role: "readWrite",
                db: "bpi"
            }
        ]
    }
);