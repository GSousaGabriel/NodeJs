const person ={
    name: 'Gabriel',
    age: 22,
    greet(){
        console.log(`Hi, ${this.name}`)
    }
};

/////// using functions
const printName= ({name})=>{
    console.log(name)
}

printName(person);

/////// using variables
const {name, age}= person;
console.log(name, age)

const hobbies= ['Sports', 'Cooking'];
const [hobbie1, hobbie2]= hobbies;

console.log(hobbie1, hobbie2);