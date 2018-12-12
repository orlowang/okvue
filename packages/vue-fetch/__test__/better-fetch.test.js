import BetterFetch, { trim, isJson } from "../better-fetch";

describe("fetch test", () => {
  // test("should polyfilled when window.fetch not exist", () => {
  //   const bf = new BetterFetch();
  //   console.log(bf.fetch)
  //   const promise_type = bf.fetch instanceof Promise;
  //   expect(promise_type).toBe(true);
  // });
  test("test post", async () => {
    const bf = new BetterFetch({ prefix: "http://api.github.com/" });
    const cb = await bf.post("", { a: 1 });
    expect(cb).toBe(true);
  });
});

// describe("functions test", () => {
//   test("should remove '/'", () => {
//     const str = "/http://api.github.com/";
//     const trim_str = trim(str, "/");
//     expect(trim_str).toBe("http://api.github.com");
//   });
//   test("should return true", () => {
//     const obj = { a: 1, b: "2", f: function() {} };
//     const json_obj = isJson(obj);
//     expect(json_obj).toBe(false);
//   });
// });
