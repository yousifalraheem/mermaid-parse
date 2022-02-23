export interface MermaidParseSVG {
  extension?: "svg";
}

export interface MermaidParsePNG {
  extension?: "png";
}

export type MermaidParseConfig = MermaidParseSVG | MermaidParsePNG;

/**
 * Parses Mermaid definition to SVG string diagram
 * @param {string} definition Mermaid definition
 * @param {MermaidParseConfig} Parser configurations
 * @returns {Promise<string | Buffer>} The Mermaid diagram in string format
 */
export default function mermaidParse(definition: string, config: MermaidParseSVG): Promise<string>;
export default function mermaidParse(definition: string, config: MermaidParsePNG): Promise<Buffer>;
export default function mermaidParse(definition: string, config: MermaidParseConfig): Promise<string | Buffer>;
