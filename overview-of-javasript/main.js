var name = "max";
console.log(name);
var age = 234;
var hasHobbies = true;

function summarizeUser(username, userage, userhobbies) {
  return `name is ${username}  and age is ${userage}, and hobbies ${userhobbies}`;
}
console.log(this);
console.log(summarizeUser("deepak", 20, "cricket"));

const newsumarizeuser = (username, userage, userhobbies) => {
  console.log(this);
  return `name is ${username}  and age is ${userage}, and hobbies ${userhobbies}`;
};
console.log(newsumarizeuser("deepak", 23, "kabadi"));

const deepak = {
  name: "deepak",
  age: 23,
  generation() {
    console.log(this);

    return "we are here bro";
  },
  newgeneration: () => {
    console.log(this);
    return "we are come to delhi";
  },
};

console.log(deepak.newgeneration());
class harshit {
  harshit() {
    this.name = "harshit atri";
    this.age = 23;
    this.college = "ccet sector 26";
    this.friends = ["deepak pal", "himanshu sharma"];
  }
  address() {
    return "i leave in chandigarh";
  }
  comment = () => {
    console.log(this);
    const findname = () => {
      console.log(this);
      console.log(this.findname);
    };
    findname();
    return "wer are in college";
  };
}
const gb = new harshit();
console.log(gb.comment());

//arrays
const numbers = ["deepak", "atri", "sharma", 23, 342, 32, 3];
console.log(numbers);
numbers.unshift("kanishka");
console.log(numbers);
numbers.shift();
console.log(numbers);
const entry = numbers.entries();
for ([a, b] of numbers.entries()) {
  console.log(a, b);
}
// const newarray = numbers.splice(1, 4);

console.log(numbers);
const [x, y, , ...rate] = numbers;
console.log(x, y, rate);

setTimeout(() => {
  console.log("we are couple anju and deepak");
}, 2000);
