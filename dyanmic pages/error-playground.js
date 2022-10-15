const sum = (a, b) => {
  if (a && b) return a + b;
  throw new Error("invalid arguments");
};
try {
  console.log(sum(1, 0));
} catch (error) {
  console.log("error ocucrse");
}
