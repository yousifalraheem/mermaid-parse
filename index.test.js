const mermaidParse = require("./index");

describe("Mermaid parser", () => {
  it("Should return a valid SVG if the definition is correct", async () => {
    const definition = `
        graph TD
        A[Christmas] -->|Get money| B(Go shopping)
        B --> C{Let me think}
        C -->|One| D[Laptop]
        C -->|Two| E[iPhone]
        C -->|Three| F
    `;

    const result = await mermaidParse(definition);

    // A valid SVG with ID starting with "mermaid"
    expect(result.startsWith("<svg id=\"mermaid")).toBeTruthy();
    // Test for some keywords in the definition
    expect(result).toMatch(/(?=.*?\biPhone)(?=.*?\bLaptop).*/gm);
  });

  it("Should return a valid SVG with error message for incorrect definition", async () => {
    const definition = `foo`;
    try {
      await mermaidParse(definition);
    } catch (e) {
      expect(e.message).toEqual("Syntax error in graph");
      expect(e.hasOwnProperty('output')).toBeTruthy();
    }
  });
});
