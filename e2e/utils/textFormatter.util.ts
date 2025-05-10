import nlp from 'compromise';


export class TextFormatter {
    public static getFirstLetterOfEachWord(str: string): string {
        return str.split(' ').map(word => word.charAt(0))
            .join('');
    }

    public static removePrepositionInSentence(str: string): string {
        const doc = nlp(str);
        const prepositions = doc.prepositions().out('array');
        const words = str.split(' ').filter(word => !prepositions.includes(word));
        return words.join(' ');
    }

    public static getNumericValue(str: string): number {
        const numericValue = str.replace(/[^0-9]/g, '');
        return parseInt(numericValue);
    }
}