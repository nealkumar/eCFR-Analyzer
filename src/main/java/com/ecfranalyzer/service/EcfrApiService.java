package com.ecfranalyzer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class EcfrApiService {
    private static final String BASE_URL = "https://www.ecfr.gov";

    @Autowired
    private RestTemplate restTemplate;

    // Admin Service endpoints

    @Cacheable("agencies")
    public Map<String, Object> getAgencies() {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/admin/v1/agencies.json")
                .build()
                .toUriString();

        log.info("Fetching agencies from {}", url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("corrections")
    public Map<String, Object> getCorrections(String date, String title, String errorCorrectedDate) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/admin/v1/corrections.json");

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (title != null) {
            builder.queryParam("title", title);
        }

        if (errorCorrectedDate != null) {
            builder.queryParam("error_corrected_date", errorCorrectedDate);
        }

        String url = builder.build().toUriString();
        log.info("Fetching corrections from {}", url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("corrections-by-title")
    public Map<String, Object> getCorrectionsByTitle(String title) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/admin/v1/corrections/title/{title}.json")
                .buildAndExpand(title)
                .toUriString();

        log.info("Fetching corrections for title {} from {}", title, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    // Search Service endpoints

    @Cacheable("search-results")
    public Map<String, Object> getSearchResults(String query, String[] agencySlugs, String date,
                                                String lastModifiedAfter, String lastModifiedOnOrAfter,
                                                String lastModifiedBefore, String lastModifiedOnOrBefore,
                                                Integer perPage, Integer page, String order, String paginateBy) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/search/v1/results");

        if (query != null) {
            builder.queryParam("query", query);
        }

        if (agencySlugs != null && agencySlugs.length > 0) {
            for (String slug : agencySlugs) {
                builder.queryParam("agency_slugs[]", slug);
            }
        }

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (lastModifiedAfter != null) {
            builder.queryParam("last_modified_after", lastModifiedAfter);
        }

        if (lastModifiedOnOrAfter != null) {
            builder.queryParam("last_modified_on_or_after", lastModifiedOnOrAfter);
        }

        if (lastModifiedBefore != null) {
            builder.queryParam("last_modified_before", lastModifiedBefore);
        }

        if (lastModifiedOnOrBefore != null) {
            builder.queryParam("last_modified_on_or_before", lastModifiedOnOrBefore);
        }

        if (perPage != null) {
            builder.queryParam("per_page", perPage);
        }

        if (page != null) {
            builder.queryParam("page", page);
        }

        if (order != null) {
            builder.queryParam("order", order);
        }

        if (paginateBy != null) {
            builder.queryParam("paginate_by", paginateBy);
        }

        String url = builder.build().toUriString();
        log.info("Searching with query {} from {}", query, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("search-count")
    public Map<String, Object> getSearchCount(String query, String[] agencySlugs, String date,
                                              String lastModifiedAfter, String lastModifiedOnOrAfter,
                                              String lastModifiedBefore, String lastModifiedOnOrBefore) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/search/v1/count");

        if (query != null) {
            builder.queryParam("query", query);
        }

        if (agencySlugs != null && agencySlugs.length > 0) {
            for (String slug : agencySlugs) {
                builder.queryParam("agency_slugs[]", slug);
            }
        }

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (lastModifiedAfter != null) {
            builder.queryParam("last_modified_after", lastModifiedAfter);
        }

        if (lastModifiedOnOrAfter != null) {
            builder.queryParam("last_modified_on_or_after", lastModifiedOnOrAfter);
        }

        if (lastModifiedBefore != null) {
            builder.queryParam("last_modified_before", lastModifiedBefore);
        }

        if (lastModifiedOnOrBefore != null) {
            builder.queryParam("last_modified_on_or_before", lastModifiedOnOrBefore);
        }

        String url = builder.build().toUriString();
        log.info("Getting count for search {} from {}", query, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("search-summary")
    public Map<String, Object> getSearchSummary(String query, String[] agencySlugs, String date,
                                                String lastModifiedAfter, String lastModifiedOnOrAfter,
                                                String lastModifiedBefore, String lastModifiedOnOrBefore) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/search/v1/summary");

        if (query != null) {
            builder.queryParam("query", query);
        }

        if (agencySlugs != null && agencySlugs.length > 0) {
            for (String slug : agencySlugs) {
                builder.queryParam("agency_slugs[]", slug);
            }
        }

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (lastModifiedAfter != null) {
            builder.queryParam("last_modified_after", lastModifiedAfter);
        }

        if (lastModifiedOnOrAfter != null) {
            builder.queryParam("last_modified_on_or_after", lastModifiedOnOrAfter);
        }

        if (lastModifiedBefore != null) {
            builder.queryParam("last_modified_before", lastModifiedBefore);
        }

        if (lastModifiedOnOrBefore != null) {
            builder.queryParam("last_modified_on_or_before", lastModifiedOnOrBefore);
        }

        String url = builder.build().toUriString();
        log.info("Getting summary for search {} from {}", query, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("counts-daily")
    public Map<String, Object> getCountsByDate(String query, String[] agencySlugs, String date,
                                               String lastModifiedAfter, String lastModifiedOnOrAfter,
                                               String lastModifiedBefore, String lastModifiedOnOrBefore) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/search/v1/counts/daily");

        if (query != null) {
            builder.queryParam("query", query);
        }

        if (agencySlugs != null && agencySlugs.length > 0) {
            for (String slug : agencySlugs) {
                builder.queryParam("agency_slugs[]", slug);
            }
        }

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (lastModifiedAfter != null) {
            builder.queryParam("last_modified_after", lastModifiedAfter);
        }

        if (lastModifiedOnOrAfter != null) {
            builder.queryParam("last_modified_on_or_after", lastModifiedOnOrAfter);
        }

        if (lastModifiedBefore != null) {
            builder.queryParam("last_modified_before", lastModifiedBefore);
        }

        if (lastModifiedOnOrBefore != null) {
            builder.queryParam("last_modified_on_or_before", lastModifiedOnOrBefore);
        }

        String url = builder.build().toUriString();
        log.info("Getting daily counts for {} from {}", query, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("counts-titles")
    public Map<String, Object> getCountsByTitle(String query, String[] agencySlugs, String date,
                                                String lastModifiedAfter, String lastModifiedOnOrAfter,
                                                String lastModifiedBefore, String lastModifiedOnOrBefore) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/search/v1/counts/titles");

        if (query != null) {
            builder.queryParam("query", query);
        }

        if (agencySlugs != null && agencySlugs.length > 0) {
            for (String slug : agencySlugs) {
                builder.queryParam("agency_slugs[]", slug);
            }
        }

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (lastModifiedAfter != null) {
            builder.queryParam("last_modified_after", lastModifiedAfter);
        }

        if (lastModifiedOnOrAfter != null) {
            builder.queryParam("last_modified_on_or_after", lastModifiedOnOrAfter);
        }

        if (lastModifiedBefore != null) {
            builder.queryParam("last_modified_before", lastModifiedBefore);
        }

        if (lastModifiedOnOrBefore != null) {
            builder.queryParam("last_modified_on_or_before", lastModifiedOnOrBefore);
        }

        String url = builder.build().toUriString();
        log.info("Getting title counts for {} from {}", query, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("counts-hierarchy")
    public Map<String, Object> getCountsByHierarchy(String query, String[] agencySlugs, String date,
                                                    String lastModifiedAfter, String lastModifiedOnOrAfter,
                                                    String lastModifiedBefore, String lastModifiedOnOrBefore) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/search/v1/counts/hierarchy");

        if (query != null) {
            builder.queryParam("query", query);
        }

        if (agencySlugs != null && agencySlugs.length > 0) {
            for (String slug : agencySlugs) {
                builder.queryParam("agency_slugs[]", slug);
            }
        }

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (lastModifiedAfter != null) {
            builder.queryParam("last_modified_after", lastModifiedAfter);
        }

        if (lastModifiedOnOrAfter != null) {
            builder.queryParam("last_modified_on_or_after", lastModifiedOnOrAfter);
        }

        if (lastModifiedBefore != null) {
            builder.queryParam("last_modified_before", lastModifiedBefore);
        }

        if (lastModifiedOnOrBefore != null) {
            builder.queryParam("last_modified_on_or_before", lastModifiedOnOrBefore);
        }

        String url = builder.build().toUriString();
        log.info("Getting hierarchy counts for {} from {}", query, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("suggestions")
    public Map<String, Object> getSearchSuggestions(String query, String[] agencySlugs, String date,
                                                    String lastModifiedAfter, String lastModifiedOnOrAfter,
                                                    String lastModifiedBefore, String lastModifiedOnOrBefore) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/search/v1/suggestions");

        if (query != null) {
            builder.queryParam("query", query);
        }

        if (agencySlugs != null && agencySlugs.length > 0) {
            for (String slug : agencySlugs) {
                builder.queryParam("agency_slugs[]", slug);
            }
        }

        if (date != null) {
            builder.queryParam("date", date);
        }

        if (lastModifiedAfter != null) {
            builder.queryParam("last_modified_after", lastModifiedAfter);
        }

        if (lastModifiedOnOrAfter != null) {
            builder.queryParam("last_modified_on_or_after", lastModifiedOnOrAfter);
        }

        if (lastModifiedBefore != null) {
            builder.queryParam("last_modified_before", lastModifiedBefore);
        }

        if (lastModifiedOnOrBefore != null) {
            builder.queryParam("last_modified_on_or_before", lastModifiedOnOrBefore);
        }

        String url = builder.build().toUriString();
        log.info("Getting suggestions for {} from {}", query, url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    // Versioner Service endpoints

    @Cacheable("ancestry")
    public Map<String, Object> getAncestry(String date, String title, String subtitle, String chapter,
                                           String subchapter, String part, String subpart, String section,
                                           String appendix) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/versioner/v1/ancestry/{date}/title-{title}.json")
                .buildAndExpand(date, title)
                .toUriString();

        log.info("Getting ancestry for title {} on {} from {}", title, date, url);

        try {
            return restTemplate.getForObject(url, HashMap.class);
        } catch (Exception e) {
            log.error("Error getting ancestry: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    public String getFullDocument(String date, String title, String subtitle, String chapter,
                                  String subchapter, String part, String subpart, String section,
                                  String appendix) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/versioner/v1/full/{date}/title-{title}.xml");

        Map<String, String> uriParams = new HashMap<>();
        uriParams.put("date", date);
        uriParams.put("title", title);

        String url = builder.buildAndExpand(uriParams).toUriString();

        // Add query parameters for hierarchy elements if provided
        UriComponentsBuilder queryBuilder = UriComponentsBuilder.fromHttpUrl(url);

        if (subtitle != null) {
            queryBuilder.queryParam("subtitle", subtitle);
        }

        if (chapter != null) {
            queryBuilder.queryParam("chapter", chapter);
        }

        if (subchapter != null) {
            queryBuilder.queryParam("subchapter", subchapter);
        }

        if (part != null) {
            queryBuilder.queryParam("part", part);
        }

        if (subpart != null) {
            queryBuilder.queryParam("subpart", subpart);
        }

        if (section != null) {
            queryBuilder.queryParam("section", section);
        }

        if (appendix != null) {
            queryBuilder.queryParam("appendix", appendix);
        }

        url = queryBuilder.toUriString();
        log.info("Getting full document for title {} on {} from {}", title, date, url);

        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            log.error("Error getting full document: {}", e.getMessage());
            return "";
        }
    }

    @Cacheable("structure")
    public Map<String, Object> getStructure(String date, String title) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/versioner/v1/structure/{date}/title-{title}.json")
                .buildAndExpand(date, title)
                .toUriString();

        log.info("Getting structure for title {} on {} from {}", title, date, url);

        try {
            return restTemplate.getForObject(url, HashMap.class);
        } catch (Exception e) {
            log.error("Error getting structure: {}", e.getMessage());
            return new HashMap<>();
        }
    }

    @Cacheable("titles")
    public Map<String, Object> getAllTitles() {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/versioner/v1/titles.json")
                .build()
                .toUriString();

        log.info("Getting all titles from {}", url);
        return restTemplate.getForObject(url, HashMap.class);
    }

    @Cacheable("versions")
    public Map<String, Object> getVersions(String title, String issueDate, String issueOnOrBefore,
                                           String issueOnOrAfter, String subtitle, String chapter,
                                           String subchapter, String part, String subpart, String section,
                                           String appendix) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/api/versioner/v1/versions/title-{title}.json");

        Map<String, String> uriParams = new HashMap<>();
        uriParams.put("title", title);

        String url = builder.buildAndExpand(uriParams).toUriString();

        // Add query parameters
        UriComponentsBuilder queryBuilder = UriComponentsBuilder.fromHttpUrl(url);

        if (issueDate != null) {
            queryBuilder.queryParam("issue_date", issueDate);
        }

        if (issueOnOrBefore != null) {
            queryBuilder.queryParam("issue_date[]", issueOnOrBefore);
        }

        if (issueOnOrAfter != null) {
            queryBuilder.queryParam("issue_date[]", issueOnOrAfter);
        }

        if (subtitle != null) {
            queryBuilder.queryParam("subtitle", subtitle);
        }

        if (chapter != null) {
            queryBuilder.queryParam("chapter", chapter);
        }

        if (subchapter != null) {
            queryBuilder.queryParam("subchapter", subchapter);
        }

        if (part != null) {
            queryBuilder.queryParam("part", part);
        }

        if (subpart != null) {
            queryBuilder.queryParam("subpart", subpart);
        }

        if (section != null) {
            queryBuilder.queryParam("section", section);
        }

        if (appendix != null) {
            queryBuilder.queryParam("appendix", appendix);
        }

        url = queryBuilder.toUriString();
        log.info("Getting versions for title {} from {}", title, url);

        try {
            return restTemplate.getForObject(url, HashMap.class);
        } catch (Exception e) {
            log.error("Error getting versions: {}", e.getMessage());
            return new HashMap<>();
        }
    }
}