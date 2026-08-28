const users = [
  {
    id: 1,
    name: "Aira",
    role: "buyer",
  },
  {
    id: 2,
    name: "Nova",
    role: "seller",
  },
  {
    id: 3,
    name: "Rin",
    role: "admin",
  },
  {
    id: 4,
    name: "Kai",
    role: "seller",
  },
];

const requestedRole = "seller";
const getrolesPerson = (user , role) => {
    return user.filter( r => r.role == role )
}
const result = getrolesPerson(users , requestedRole);
console.log(result);