import { mount } from "@vue/test-utils";
import page from "./page";

describe("fetch single github repo", () => {
  test("fetch single github repo", () => {
    const page = mount(page);
    console.log(page)
    // expect(page);
  });
});
