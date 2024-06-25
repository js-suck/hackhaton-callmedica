const User = require('../../src/models/user.model');

const userFixtures = [
    {
        email: "toto@tata.fr",
        firstname: "Toto",
        lastname: "Tata",
        location: "Paris 12e",
        birthDate: "1999-02-10",
        currentAddress: "10 rue de l'ananas",
    },
    {
        email: "alice@example.com",
        firstname: "Alice",
        lastname: "Wonderland",
        location: "Melun",
        birthDate: "1985-05-12",
        currentAddress: "12 rue de la pomme",
    },
    {
        email: "bob@example.com",
        firstname: "Bob",
        lastname: "Builder",
        location: "Montpellier",
        birthDate: "1978-09-23",
        currentAddress: "15 rue du marteau",
    },
    {
        email: "charlie@example.com",
        firstname: "Charlie",
        lastname: "Chocolate",
        location: "Evry",
        birthDate: "2000-11-05",
        currentAddress: "18 rue du cacao",
    },
    {
        email: "dora@example.com",
        firstname: "Dora",
        lastname: "Explorer",
        location: "Poitier",
        birthDate: "1992-04-15",
        currentAddress: "20 rue de la carte",
    }
];

User.bulkCreate(userFixtures)
    .then(() => {
        console.log('User fixtures created successfully');
    })
    .catch((error) => {
        console.error('Error creating user fixtures:', error);
    });
