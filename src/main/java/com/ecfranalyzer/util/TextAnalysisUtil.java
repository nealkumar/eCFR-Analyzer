package com.ecfranalyzer.util;

import org.springframework.stereotype.Component;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TextAnalysisUtil {

    private static final Set<String> COMMON_STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "in", "of", "with"
    ));

    /**
     * Count words in a text string, excluding XML/HTML tags
     */
    public int countWords(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        // Remove XML/HTML tags
        String cleanText = text.replaceAll("<[^>]*>", " ");

        // Replace multiple spaces with a single space
        cleanText = cleanText.replaceAll("\\s+", " ").trim();

        // Split by whitespace and count
        if (cleanText.isEmpty()) {
            return 0;
        }

        return cleanText.split("\\s+").length;
    }

    /**
     * Count non-stop words in a text string
     */
    public int countNonStopWords(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        // Remove XML/HTML tags
        String cleanText = text.replaceAll("<[^>]*>", " ");

        // Replace multiple spaces with a single space
        cleanText = cleanText.replaceAll("\\s+", " ").trim();

        // Split by whitespace and count non-stop words
        if (cleanText.isEmpty()) {
            return 0;
        }

        String[] words = cleanText.split("\\s+");
        int count = 0;

        for (String word : words) {
            String lowercaseWord = word.toLowerCase();
            if (!COMMON_STOP_WORDS.contains(lowercaseWord)) {
                count++;
            }
        }

        return count;
    }

    /**
     * Extract dates in YYYY-MM-DD format from text
     */
    public Set<String> extractDates(String text) {
        Set<String> dates = new HashSet<>();

        if (text == null || text.isEmpty()) {
            return dates;
        }

        // Pattern for YYYY-MM-DD
        Pattern pattern = Pattern.compile("\\b(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            dates.add(matcher.group());
        }

        return dates;
    }

    /**
     * Calculate the Flesch Reading Ease score for readability
     * Higher scores = easier to read
     */
    public double calculateReadabilityScore(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        // Remove XML/HTML tags
        String cleanText = text.replaceAll("<[^>]*>", " ");

        // Count sentences (roughly)
        int sentences = countSentences(cleanText);
        if (sentences == 0) {
            return 0;
        }

        // Count words
        int words = countWords(cleanText);
        if (words == 0) {
            return 0;
        }

        // Count syllables (rough approximation)
        int syllables = countSyllables(cleanText);

        // Flesch Reading Ease = 206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)
        double wordsPerSentence = (double) words / sentences;
        double syllablesPerWord = (double) syllables / words;

        return 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
    }

    private int countSentences(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        // Simple sentence counter - split by .!?
        // This is a simplification; real sentence detection would need NLP
        return text.split("[.!?]+").length;
    }

    private int countSyllables(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        String[] words = text.split("\\s+");
        int syllableCount = 0;

        for (String word : words) {
            syllableCount += countWordSyllables(word);
        }

        return syllableCount;
    }

    private int countWordSyllables(String word) {
        // Simple syllable counter - count vowel groups
        // This is a rough approximation
        word = word.toLowerCase().replaceAll("[^a-z]", "");

        if (word.isEmpty()) {
            return 0;
        }

        // Special case for words ending in 'e'
        if (word.endsWith("e")) {
            word = word.substring(0, word.length() - 1);
        }

        String vowels = "aeiouy";
        int count = 0;
        boolean lastWasVowel = false;

        for (char c : word.toCharArray()) {
            boolean isVowel = vowels.indexOf(c) >= 0;

            if (isVowel && !lastWasVowel) {
                count++;
            }

            lastWasVowel = isVowel;
        }

        // Ensure at least one syllable per word
        return Math.max(count, 1);
    }
}