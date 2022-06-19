var fs = require('fs');

//readFileSync

// console.log('a');
// var result = fs.readFileSync('syntax/sample.txt', 'utf-8');
// console.log(result);
// console.log('C');

console.log('A');
fs.readFile('syntax/sample.txt', 'utf-8', (err, result)=>{
    console.log(result);    
});
console.log('C');