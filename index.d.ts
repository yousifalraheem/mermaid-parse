export interface MermaidParseConfig {
  extension?: "svg" | "png";
}

/**
 * Parses Mermaid definition to SVG string diagram
 * @param {string} definition Mermaid definition
 * @param {MermaidParseConfig} config configurations
 * @returns {Promise<string>} The Mermaid diagram in HTML string format
 */
export default function mermaidParse(definition: string, config?: MermaidParseConfig): Promise<string>;
