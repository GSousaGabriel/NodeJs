const sum =(a,b)=>{
    if(a&& b){
        return a+b
    }
    throw new Error('error')
}

try{
    console.log(sum(1))
}catch(error){
    console.log('has error')
}

console.log('keeps running')