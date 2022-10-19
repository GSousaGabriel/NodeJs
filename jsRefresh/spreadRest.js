const hobbies= ['Sports', 'Cooking'];
const anotherHobby=['Programming']

const copiedArray= [anotherHobby, ...hobbies];

console.log(copiedArray);

/////////////////////////////////////rest

const toArray= (...args)=>args;

console.log(toArray(1, 2, 3, 4));