package com.ecfranalyzer.service;

import com.ecfranalyzer.model.analytics.ChangeFrequencyResult;
import com.ecfranalyzer.model.analytics.WordCountResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SummaryService {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Generate an AI summary of the eCFR analytics data
     */
    public String generateSummary() {
        StringBuilder summary = new StringBuilder();

        // Get top agencies by word count
        List<WordCountResult> topAgenciesByWords = analyticsService.getWordCountsByAgency()
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        // Get top agencies by change frequency
        List<ChangeFrequencyResult> topAgenciesByChanges = analyticsService.getChangeFrequencyByAgency()
                .stream()
                .limit(5)
                .toList();

        // Build summary text
        summary.append("# eCFR Analytics Summary (Effective Aggregation Date of 12/12/2020\n\n");

        // Word count summary
        summary.append("## Largest Federal Regulations by Word Count\n\n");
        summary.append("The five largest agencies by regulation word count are:\n\n");

        for (int i = 0; i < topAgenciesByWords.size(); i++) {
            WordCountResult result = topAgenciesByWords.get(i);
            summary.append(String.format("%d. **%s**: %,d words (%.1f%% of total regulations)\n",
                    i + 1,
                    result.getEntityName(),
                    result.getWordCount(),
                    result.getPercentageOfTotal()));
        }

        // Change frequency summary
        summary.append("\n## Most Frequently Updated Regulations\n\n");
        summary.append("The five agencies with the most frequent historical changes are:\n\n");

        for (int i = 0; i < topAgenciesByChanges.size(); i++) {
            ChangeFrequencyResult result = topAgenciesByChanges.get(i);
            summary.append(String.format("%d. **%s**: %,d total changes (avg. %.1f changes per year)\n",
                    i + 1,
                    result.getEntityName(),
                    result.getTotalChanges(),
                    result.getChangesPerYear()));
        }

        // Additional insights
        summary.append("\n## Key Insights\n\n");

        // Find agency with highest percentage of total
        WordCountResult largestAgency = topAgenciesByWords.isEmpty() ? null : topAgenciesByWords.get(0);
        if (largestAgency != null) {
            summary.append(String.format("- The **%s** has the largest share of federal regulations at %.1f%% of total word count.\n",
                    largestAgency.getEntityName(),
                    largestAgency.getPercentageOfTotal()));
        }

        // Find agency with most frequent changes
        ChangeFrequencyResult mostChangedAgency = topAgenciesByChanges.isEmpty() ? null : topAgenciesByChanges.get(0);
        if (mostChangedAgency != null) {
            summary.append(String.format("- Regulations from the **%s** change most frequently with an average of %.1f updates per year.\n",
                    mostChangedAgency.getEntityName(),
                    mostChangedAgency.getChangesPerYear()));
        }

        return summary.toString();
    }
}