"use strict";

// let user = {
//   firstName: "Ilya",
//   sayHi() {
//     let arrow = () => alert(this.firstName);
//     arrow();
//   },
// };

// user.sayHi(); // Ilya

// var createCounter = function(n) {
//     let counter = n
//     return function() {
//        return counter++
//     };
// };


const cat = {
  text: "meow",
  test2: () => {
    console.log(this);
  },
  test4: function t2() {
    console.log(this);
  },
  say: () => {
    console.log(this.text);
  },
  say2() {
    console.log(this.text);
  },
  generateSay() {
    return () => console.log(this.text);
  },
  test: function t() {
    console.log(this.text);
  },
  time: function tet() {
    setTimeout(function a() {
      console.log(this.text);
    }, 1000)
  }
};
cat.time()
// cat.test2()
// cat.test4()
// cat.test()
// cat.say();
// cat.say2();
// let say3 = cat.generateSay();
// say3();


// const { say, say2, generateSay } = cat;
// say(); // undefined
// say2(); // undefined
// let say31 = generateSay();
// say31(); // undefined

// class Cat {
//   text = "meow";
//   say11 = () => {
//     console.log(this.text);
//   };
//   say12() {
//     console.log(this.text);
//   }
// }

// const cat2 = new Cat();
// cat2.say11(); // 'meow'
// cat2.say12(); // 'meow'

// let { say11, say12 } = cat2;

// say11(); // 'meow'
// say12(); // undefined
