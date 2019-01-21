const { utils } = require("ethers");

const guess = (target) => {
  for (let i = 0; i < 256; i++) {
    const result = utils.solidityKeccak256(
      ["uint8"],
      [i]
    );

    if (result == target) {
      return i;
    }
  }

  throw new Error("Answer not found");
}

try {
  const target = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";

  const result = guess(target);

  console.log(result);
} catch (err) {
  console.error(err);
}
