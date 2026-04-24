---
layout: base.njk
title: Research
description: Dr. Hadiza Galadima — research in biostatistics, machine learning in health outcomes, cancer disparities, and public-health methodology. Peer-reviewed publications and funded projects at Old Dominion University.
permalink: /research/
schemaType: CollectionPage
---

# Research

## Interests

My research program sits at the intersection of **statistical methodology** and **applied public-health research**. Three overlapping strands:

**Cancer disparities & early-onset colorectal cancer.** A line of work I've been building since my EVMS days, extending through several intramural and extramural grants. I look at how neighborhood characteristics, environmental exposures, and structural barriers shape stage-at-diagnosis and treatment patterns — with particular attention to young-onset cases in underserved populations.

**Machine learning in health outcomes.** Over the past several years I've been applying machine-learning approaches to problems where classical regression struggles: high-dimensional predictors, complex interactions, and data quality issues typical of registry-based and population-based studies. Recent work applies these methods to colorectal cancer outcomes, breast cancer recurrence, and cancer risk prediction across socioeconomic gradients.

**Methods for confounding & propensity scores.** My doctoral work on propensity-score methods when association is measured by AUC remains active — in subsequent publications I've shown that naive propensity-score adjustment can bias the conditional AUC, a subtle but consequential finding for diagnostic-accuracy studies in observational data.

**By the numbers**: 20 peer-reviewed journal articles, 19 published abstracts, 54 conference presentations, 8 invited talks. Principal Investigator on 9 awarded grants in cancer, machine-learning, and health-disparities research.

## Publications

<p class="research-note"><em>All {{ publications.publications.length }} peer-reviewed journal articles. Each paper has its own page with summary, citation-ready BibTeX &amp; RIS export, and DOI link. Newest first.</em></p>

<ol class="pub-list">
{% for pub in publications.publications %}
<li class="pub-entry">
<span class="pub-authors">{% for a in pub.authors %}{{ a }}{% if not loop.last %}{% if loop.revindex0 == 1 %}, &amp; {% else %}, {% endif %}{% endif %}{% endfor %}</span>
(<span class="pub-year">{{ pub.year }}</span>).
<a href="/research/pub/{{ pub.slug }}/" class="pub-title-link"><span class="pub-title">{{ pub.title }}.</span></a>
<span class="pub-venue"><em>{{ pub.journal }}</em>{% if pub.volume %}, {{ pub.volume }}{% if pub.issue %}({{ pub.issue }}){% endif %}{% endif %}{% if pub.pages %}, {{ pub.pages }}{% endif %}.</span>
{% if pub.doi %}<a href="{{ pub.url }}" class="pub-doi-link" rel="external">doi:{{ pub.doi }}</a>{% endif %}
</li>
{% endfor %}
</ol>

## Selected grants

- **Knowledge, Attitude, and Perceived Barriers towards Breast Cancer Screening among Female African Immigrants** — Johns Hopkins University (2025–2026).
- **Predicting Health Outcomes Among Cancer Patients in Virginia: A Population-Based Machine Learning Approach** — ODU School of Public Health Initiatives Intramural Grant (2023–2024).
- **Examining the Role of Neighborhood Characteristics on Geographic Variation in Colorectal Cancer: Spatial Analysis, Hierarchical Modeling, and Machine Learning Approaches** — ODU SPH Intramural Grant (2022).
- **Assessing the Impacts of the COVID-19 Pandemic on U.S. Hispanic/Latino Farmworkers** — Johns Hopkins University (2021–2023).
- **Understanding the Implications of Environmental Exposures in Colorectal Cancer Mortality in Virginia** — Mary Louise Andrews Award for Cancer Research, Virginia Academy of Science (2019–2020).
- **Individual and Neighborhood Predictors of Late-Stage Colorectal Cancer and Mortality, Virginia 2008–2016** — EVMS Sentara Healthcare Analytics and Delivery Science Institute (2017–2018).

## Current projects

- **Breast cancer recurrence prediction** (ongoing): machine-learning approaches to population-based surveillance strategies. Presented at APHA 2025.
- **Racial and ethnic disparities in breast cancer recurrence** (ongoing): population-based cohort analysis, Virginia. Presented at APHA 2025.

## Dissertation committee chair

Chairing dissertation committees in the PhD in Health Services Research program at ODU:

- **Rexford Anson-Dwamena** (2023–present)
- **Mya Achike** — *Occupational Stress and Coping During a Public Health Emergency* (defended 2024)
- **Anne Dumadag** — *Mental Health Among the Asian American Population* (2022–2024)
- **Brenda Berumen-Flucker** — *Acculturative Stressors and Cultural Factors in Health and Safety of Hispanic/Latino Farmworkers* (defended 2022)

---

<p><strong>Looking for the calculator?</strong> The open tools I built for teaching live at <a href="https://ztchi.hgaladima.com/">ztchi.hgaladima.com</a> — free, no signup, no tracking, work shown.</p>
