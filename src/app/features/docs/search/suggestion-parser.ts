export type SuggestionSegment = 
    | { type: 'text'; content: string; bold?: boolean; code?: boolean }
    | { type: 'header'; level: number; content: string }
    | { type: 'pasted'; count: string }
    | { type: 'bullet'; segments: SuggestionSegment[] };

export function parseSuggestion(text: string): SuggestionSegment[] {
    if (!text) return [];

    const segments: SuggestionSegment[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trimStart();
        
        // 1. Check for headers (# , ## , ### )
        const headerMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
        if (headerMatch) {
            segments.push({ 
                type: 'header', 
                level: headerMatch[1].length, 
                content: headerMatch[2] 
            });
            continue;
        }

        // 2. Check for bullet points (* or -)
        const bulletMatch = trimmed.match(/^[*|-]\s+(.*)$/);
        if (bulletMatch) {
            const bulletSegments: SuggestionSegment[] = [];
            parseLineContent(bulletMatch[1], bulletSegments);
            segments.push({ 
                type: 'bullet', 
                segments: bulletSegments 
            });
            continue;
        }

        // 3. Regular line processing
        parseLineContent(line, segments);
        
        if (i < lines.length - 1) {
            segments.push({ type: 'text', content: '\n' });
        }
    }

    return segments;
}

function parseLineContent(line: string, target: SuggestionSegment[]) {
    // Matches: **bold**, `code`, [Pasted Text]
    const combinedRegex = /(\*\*.*?\*\*)|(`.*?`)|(\[Pasted Text: \d+ chars\])/g;
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
            target.push({ type: 'text', content: line.substring(lastIndex, match.index) });
        }

        const fullMatch = match[0];
        if (fullMatch.startsWith('**')) {
            target.push({ type: 'text', content: fullMatch, bold: true });
        } else if (fullMatch.startsWith('`')) {
            const codeContent = fullMatch.substring(1, fullMatch.length - 1);
            target.push({ type: 'text', content: codeContent, code: true });
        } else {
            const countMatch = fullMatch.match(/(\d+)/);
            target.push({ type: 'pasted', count: countMatch ? countMatch[0] : '?' });
        }
        
        lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < line.length) {
        target.push({ type: 'text', content: line.substring(lastIndex) });
    }
}
