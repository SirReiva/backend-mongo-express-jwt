db.createUser(
    {
        user: "root",
        pwd: "root",
        roles: [
            {
                role: "readWrite",
                db: "cms"
            }
        ]
    }
)

db.users.insert({
    role:"SUPER",
    active: true,
    email:"admin@admin.com",
    name:"admin",
    password:"$2b$10$4M0TYC.mb4ceUFOzVt9XFekAsNj21BqKkSdrsti7qrNwIMGPbLUyG",
    createdAt:"2020-04-25T15:18:49.670+00:00",
    updatedAt: "2020-04-25T15:18:49.670+00:00"
})