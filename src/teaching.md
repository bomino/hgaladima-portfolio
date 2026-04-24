---
layout: base.njk
title: Teaching
description: Teaching biostatistics at Old Dominion University — MPHO 605, open-source tools, and a pedagogy-first approach to applied statistics.
permalink: /teaching/
schemaType: Course
---

# Teaching

## MPHO 605 — Biostatistics

{% raw %}{{ UPDATE: 2 paragraphs on MPHO 605. First paragraph: who the students are, what they'll learn, how you run it. Second paragraph: what makes your version of the course distinct — e.g., emphasis on effect sizes over p-values, live use of the calculator, writing-based assessment, etc. }}{% endraw %}

**Format**: {% raw %}{{ UPDATE: semester, credit hours, blended/in-person/online }}{% endraw %}

**Prerequisites**: {% raw %}{{ UPDATE: any prereqs, or "None — we start from the ground up" }}{% endraw %}

## Teaching philosophy

I teach biostatistics the way I wish I'd been taught: **effect sizes first, hypothesis tests second**. A p-value is a single binary decision; an effect size with a confidence interval is a story about magnitude, precision, and uncertainty — which is what public-health research is actually about.

In practice this means:

- **No test in isolation.** Every test comes with its effect-size partner (Cohen's *d* for t, Cramér's V for chi-square, odds ratios for 2×2). The test answers "could this be chance?"; the effect size answers "does it matter?"
- **Assumptions get equal airtime.** Normality, independence, variance — we check them, and when they fail we talk about what to do instead. Students leave knowing that a Wilcoxon is not scary.
- **Interpretation is a writing skill.** Half the assessment in my course is writing plain-English interpretations of statistical results for public-health audiences. If you can't explain what p=0.04 means to a policymaker, you haven't learned it.

This philosophy follows the American Statistical Association's 2016 statement on p-values, the GAISE 2016 recommendations, and Geoff Cumming's *New Statistics* framing. None of it is original to me — what I've added is a set of open tools that make it practical for students to do the right thing without needing a stats package on day one.

## Open tools for my students (and yours)

The [**Z-t-Chi Calculator**](https://ztchi.hgaladima.com/) is a free, browser-only biostatistics toolkit I built for MPHO 605 students and released for anyone to use. It covers:

- Z-tests, t-tests (one/two/paired), chi-square, Fisher exact
- Epidemiology 2×2 (risk ratio, odds ratio, sensitivity, specificity, PPV/NPV)
- Multiple-comparison corrections (Bonferroni, Holm, Benjamini-Hochberg) with a live Type I inflation visualization
- Sampling-distribution simulations for building CLT and p-value intuition
- An Assumption Coach (Shapiro-Wilk, Jarque-Bera, visual checks)

**No ads, no tracking, no signup.** All math runs in the browser. Source code is [public on GitHub](https://github.com/bomino/Z-t-Chi-Calculator) — instructors can fork it, students can audit it, anyone can verify the formulas.

## Guest teaching / invited lectures

{% raw %}{{ UPDATE: list any guest lectures, workshops, or cross-department teaching, or delete this section }}{% endraw %}

## Office hours

{% raw %}{{ UPDATE: office hours and location, or a link to a scheduling page }}{% endraw %}

## For instructors adopting the calculator

If you'd like to use Z-t-Chi in your own course, the [`teach.hgaladima.com`](https://teach.hgaladima.com/) instructor builder (private, by invitation) lets you create signed problem links for your students. [Email me](/contact/) if you'd like access — it's free.
