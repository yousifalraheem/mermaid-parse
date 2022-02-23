export interface MermaidParseSVG {
  extension?: "svg";
}

export interface MermaidParsePNG {
  extension?: "png";
}

export type MermaidParseConfig = MermaidParseSVG | MermaidParsePNG;

interface MermaidParse {
  mermaidParse: {
    (definition: string, config: MermaidParseSVG): Promise<string>;
    (definition: string, config: MermaidParsePNG): Promise<Buffer>;
    (definition: string, config: MermaidParseConfig): Promise<string | Buffer>;
  }
}

/**
 * Parses Mermaid definition to SVG string diagram
 * @param {string} definition Mermaid definition
 * @param {MermaidParseConfig} Parser configurations
 * @returns {Promise<string | Buffer>} The Mermaid diagram in string format
 */
type mermaidParse = MermaidParse["mermaidParse"];
export { mermaidParse };
export default mermaidParse;
