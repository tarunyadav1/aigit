import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import ini from 'ini';

const configPath = path.join(os.homedir(), '.aigit');

/**
 * Fetch the API key from the .aicommits file
 * @returns {Promise<string|null>} API key if exists, null otherwise
 */
async function getAPIKey() {
    try {
        const fileContent = await fs.readFile(configPath, 'utf8');
        const config = ini.parse(fileContent);
        return config.API || null;
    } catch (error) {
        console.error('Error reading API key:', error);
        return null;
    }
}

export {
    getAPIKey
};
