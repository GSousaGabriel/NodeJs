const person ={
    name: 'Gabriel',
    age: 22,
    greet(){
        console.log(`Hi, ${this.name}`)
    }
    /*greet: ()=>{
        console.log(`Hi, ${this.name}`)
    } doesn't work because of scope */
};

person.greet();