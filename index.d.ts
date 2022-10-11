import { LaunchOptions } from "puppeteer";

export interface MermaidParseConfig {
  extension?: "svg" | "png";
}
/**
 * Parses Mermaid definition to SVG string diagram
 * @param {string} definition Mermaid definition
 * @param {MermaidParseConfig} config configurations
 * @param {LaunchOptions} puppeteerConfing Puppeteer launch options
 * @returns {Promise<string>} The Mermaid diagram in HTML string format
 */
export default function mermaidParse(
  definition: string,
  config?: MermaidParseConfig,
  puppeteerConfig?: LaunchOptions
): Promise<string>;
