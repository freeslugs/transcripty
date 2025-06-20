#!/usr/bin/env node
// main.js - A script to extract chat logs from HTML and save as text and markdown files.

import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander'; // Import Commander.js

/**
 * Extracts chat messages from an HTML string based on specific class names.
 * @param {string} htmlContent The HTML content as a string.
 * @returns {string[]} An array of formatted chat messages (e.g., "Speaker: Message").
 */
function extractChatLog(htmlContent) {
    const chatLog = [];
    // Regular expression to find each chat entry block.
    // The 's' flag (dotAll) allows '.' to match newlines.
    // The 'g' flag ensures all matches are found.
    const entryRegex = /<div class="nMcdL bj4p3b">.*?<span class="NWpY1d">(.*?)<\/span>.*?<div class="ygicle VbkSUe">(.*?)<\/div>.*?<\/div>/gs;

    let match = entryRegex.exec(htmlContent);
    while (match !== null) {
        // match[1] is the speaker's name
        // match[2] is the chat message content
        const speaker = match[1].trim();
        const message = match[2].trim();
        chatLog.push(`${speaker}: ${message}`);
        match = entryRegex.exec(htmlContent);
    }

    return chatLog;
}

/**
 * Formats chat messages for markdown output
 * @param {string[]} chatMessages Array of chat messages
 * @returns {string} Formatted markdown content
 */
function formatAsMarkdown(chatMessages) {
    const header = '# Google Meet Chat Log\n\n';
    const formattedMessages = chatMessages.map(message => {
        const [speaker, ...messageParts] = message.split(': ');
        const messageText = messageParts.join(': ');
        return `**${speaker}:** ${messageText}`;
    });
    return header + formattedMessages.join('\n\n');
}

/**
 * Main function to handle command-line arguments, read HTML, extract chat, and save to file.
 */
async function main() {
    const program = new Command();

    program
        .name('transcripty')
        .description('Extracts chat logs from Google Meet HTML files and saves them to text and markdown files')
        .version('0.0.1')
        .argument('<html-file-path>', 'Path to the HTML file containing the chat log')
        .option('-o, --output <path>', 'Output directory or file path (without extension)')
        .option('--txt-only', 'Only generate .txt file')
        .option('--md-only', 'Only generate .md file')
        .action(async (inputFilePath, options) => {
            try {
                // Determine output path
                let outputBasePath;
                if (options.output) {
                    outputBasePath = options.output;
                } else {
                    const inputBaseName = path.basename(inputFilePath, path.extname(inputFilePath));
                    outputBasePath = path.join(path.dirname(inputFilePath), `${inputBaseName}_chat`);
                }

                // Read the HTML file content
                const htmlContent = await fs.readFile(inputFilePath, 'utf8');

                // Extract the chat log
                const chatMessages = extractChatLog(htmlContent);

                if (chatMessages.length === 0) {
                    console.warn('No chat messages found in the provided HTML file.');
                    
                    if (!options.mdOnly) {
                        await fs.writeFile(`${outputBasePath}.txt`, 'No chat messages found.');
                        console.log(`Empty chat log (TXT) created at: ${outputBasePath}.txt`);
                    }
                    
                    if (!options.txtOnly) {
                        await fs.writeFile(`${outputBasePath}.md`, '# Google Meet Chat Log\n\nNo chat messages found.');
                        console.log(`Empty chat log (MD) created at: ${outputBasePath}.md`);
                    }
                    return;
                }

                // Generate outputs
                if (!options.mdOnly) {
                    // Save as text file
                    const formattedText = chatMessages.join('\n\n');
                    await fs.writeFile(`${outputBasePath}.txt`, formattedText);
                    console.log(`Chat log (TXT) successfully saved to: ${outputBasePath}.txt`);
                }

                if (!options.txtOnly) {
                    // Save as markdown file
                    const formattedMarkdown = formatAsMarkdown(chatMessages);
                    await fs.writeFile(`${outputBasePath}.md`, formattedMarkdown);
                    console.log(`Chat log (MD) successfully saved to: ${outputBasePath}.md`);
                }

            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.error(`Error: File not found at '${inputFilePath}'. Please check the path.`);
                } else {
                    console.error(`An unexpected error occurred: ${error.message}`);
                }
                process.exit(1);
            }
        });

    program.parse(process.argv);
}

// Execute the main function
main();
