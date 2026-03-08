1. What is the difference between var, let, and const?
Ans: var, let, and const are used to declare variables in JavaScript. var is the old way to declare a variable. It can be re-declared and updated. let is the modern way. It can be updated but cannot be declared again in the same scope. const is used for values that should not change. It cannot be updated or re-declared. 

=================================================================================

2. What is the spread operator (...) ?
Ans: The spread operator ... is used to expand elements of an array or object. It helps to copy or combine arrays and objects easily.
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5];
Now arr2 becomes: [1, 2, 3, 4, 5]

=================================================================================

3. What is the difference between map(), filter(), and forEach()?
Ans. These are array methods used to work with array elements.

map() creates a new array by changing each element.
filter() creates a new array with elements that match a condition.
forEach() only loops through the array, it does not return a new array.

Example:
let numbers = [1,2,3,4];
numbers.forEach(n => console.log(n));
let double = numbers.map(n => n * 2);
let big = numbers.filter(n => n > 2);

=================================================================================

4. What is an arrow function?
Ans: Arrow function is a shorter way to write functions in JavaScript. It was introduced in ES6 and makes the code more simple.

Normal function:
function add(a, b) {
  return a + b;
}

Arrow function:
const add = (a, b) => a + b;

Both work the same but arrow function is shorter.

=================================================================================

5. What are template literals?
Ans: Template literals are used to write strings in an easy and dynamic way. They use backticks ` ` instead of quotes. They also allow variables inside the string using ${}.

let name = "Kabir";
let message = `Hello my name is ${name}`;
Output: Hello my name is Kabir

So template literals help to combine text and variables easily.

