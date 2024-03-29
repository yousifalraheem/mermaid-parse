const mermaidParse = require("./index");

describe("Mermaid parser", () => {
  const definition = `
      graph TD
      A[Christmas] -->|Get money| B(Go shopping)
      B --> C{Let me think}
      C -->|One| D[Laptop]
      C -->|Two| E[iPhone]
      C -->|Three| F
  `;

  it("Should return a valid SVG if the definition is correct", async () => {
    const result = await mermaidParse(definition);

    // A valid SVG with ID starting with "mermaid"
    expect(result.startsWith('<svg id="mermaid')).toBeTruthy();
    // Test for some keywords in the definition
    expect(result).toMatch(/(?=.*?\biPhone)(?=.*?\bLaptop).*/gm);
  }, 120000);

  it("Should return a valid SVG with error message for incorrect definition", async () => {
    const definition2 = `foo`;
    try {
      await mermaidParse(definition2);
    } catch (e) {
      expect(e.message).toEqual("Syntax error in graph");
      expect(e.hasOwnProperty("output")).toBeTruthy();
    }
  }, 120000);

  describe("Should support both svg and png outputs", () => {
    test("SVG", async () => {
      const result = await mermaidParse(definition, { extension: "svg" });

      expect(result.startsWith("<svg")).toBeTruthy();
    }, 120000);

    test("PNG", async () => {
      const result = await mermaidParse(definition, { extension: "png" });

      expect(result.startsWith("<img")).toBeTruthy();
    }, 120000);
  });
});
