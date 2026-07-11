import { execSync } from 'node:child_process';

// Build-time deploy stamp: proves the site is alive and hand-maintained.
// Computed once at module load so it isn't re-run for every page that renders the footer.
const git = (cmd: string) => {
    try {
        return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] })
            .toString()
            .trim();
    } catch {
        return '';
    }
};

// %n (newline) separator avoids shell metacharacters; a literal | would be parsed as a pipe by execSync's shell.
const [sha, shaFull, iso] = git('git log -1 --format=%h%n%H%n%cI').split('\n');
const remoteMatch = git('git remote get-url origin').match(/github\.com[:/](.+?)(?:\.git)?$/);

export const buildSha = sha;
export const commitUrl = remoteMatch && shaFull ? `https://github.com/${remoteMatch[1]}/commit/${shaFull}` : '';
export const buildDate = iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    : '';
