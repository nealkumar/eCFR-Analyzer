package com.ecfranalyzer.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agency {
    @Id
    private String id;

    private String name;
    private String shortName;
    private String displayName;
    private String sortableName;
    private String slug;

    @OneToMany(mappedBy = "agency")
    private List<Title> titles = new ArrayList<>();

    @Transient
    private List<CfrReference> cfrReferences = new ArrayList<>();

    @Transient
    private List<Agency> children = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CfrReference {
        private String title;
        private String chapter;
    }
}