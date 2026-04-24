---
layout: post.njk
title: Teaching biostatistics effect-sizes-first
date: 2026-04-22
summary: Why my graduate biostatistics course starts from effect sizes and confidence intervals rather than p-values — and what changes when you do. A case for taking the ASA 2016 statement seriously in course design.
tags:
  - teaching
  - pedagogy
  - effect-sizes
  - statistics-education
permalink: /blog/teaching-philosophy-effect-sizes-first/
---

The first hour of my graduate biostatistics course does not mention p-values.

This is not an accident, and it is not gimmicky. It is a considered response to three different professional documents that, read together, say the same thing: **we've been teaching statistics in the wrong order**.

## The three documents

The American Statistical Association's 2016 [statement on p-values](https://amstat.tandfonline.com/doi/full/10.1080/00031305.2016.1154108) is the shortest and most pointed. Six principles, one paragraph each. The one I keep coming back to is Principle 3: *"Scientific conclusions and business or policy decisions should not be based only on whether a p-value passes a specific threshold."* Not "should be informed by other evidence too" — *should not be based only on*. This is the field's professional society telling us, in plain English, that the standard pedagogy — which produces graduates whose first question is "is p less than 0.05?" — is producing the wrong habits.

The GAISE 2016 recommendations ([*Guidelines for Assessment and Instruction in Statistics Education*](https://www.amstat.org/asa/files/pdfs/GAISE/GaiseCollege_Full.pdf)) are longer and more about classroom practice. Recommendation 1 is *"Teach statistical thinking"* — which, in the document's expansion, means: teach students to notice variation, to ask where the data came from, to reason about uncertainty. Recommendation 3 is *"Integrate real data with a context and purpose."* Not toy data. Not abstract formulas on a blackboard. Actual data, messy, from an actual question someone cared about answering.

Geoff Cumming's *New Statistics* framing (his [2014 *Psychological Science* paper](https://journals.sagepub.com/doi/10.1177/0956797613504966) is the accessible version) is the most opinionated of the three. His argument: teach students to think in terms of effect sizes, confidence intervals, and meta-analysis. Treat p-values as a secondary tool, not the primary output. Research on learning shows that students who are taught this way don't just score better on tests of statistical reasoning; they *change how they read research* for the rest of their careers.

None of these documents is new. The ASA statement is [nearly a decade old](https://doi.org/10.1080/00031305.2016.1154108). Cumming has been making this case since the early 2000s. GAISE has been revised twice since its 2005 first edition. And yet: pick up the textbook in front of you, open to the chapter on t-tests, and count how many pages go by before you see a p-value. In most textbooks: one. Sometimes zero.

## What changing the order actually looks like

In my MPHO 605 course, the sequence is:

1. **What is an effect size?** Cohen's *d*, the correlation coefficient, the odds ratio, Cramér's V. One lecture, all examples, no test statistics. Students leave able to read a result like "Cohen's *d* = 0.3" and say what it means in plain language.
2. **What is a confidence interval?** Visually, as a range of plausible values. Computationally, as a function of a sample estimate and its standard error. Before any t-test is computed, students can look at a CI and answer "does this estimate include the null? Is it precise? Is it imprecise?"
3. **Then — and only then — what is a p-value?** Introduced as "the probability of observing an effect size this extreme (or more extreme), *if there were no real effect*." Not a binary decision. Not a measure of importance. A specific conditional probability, defined carefully, with its limitations on the board.

By the time we get to test statistics — z, t, chi-square, F — students already understand what the tests are *for*. The test is the formal decision rule; the effect size with its CI is the story.

This is not about hiding p-values or pretending they don't exist. They are useful! They formalize a useful question: could this plausibly be chance? But they are not useful *first*. Starting with p-values teaches students that the p-value is the point of statistics, and that is exactly the misconception the ASA told us to stop teaching.

## What changes when you teach this way

Two things, both measurable in my own course outcomes and in the broader research literature on statistics education:

**Student writing gets better.** When I ask students to write a 200-word interpretation of a trial result for a policymaker, effect-sizes-first students reliably mention the effect size, the interval, and the caveat. P-values-first students write about whether the result was "significant" and stop.

**Students stop being afraid of non-significance.** If a result has a tiny effect size and a wide CI, a student who thinks in terms of effect sizes can say "the data don't distinguish this from noise, but the sample is too small to rule out a meaningful effect — we'd want more data." A student who thinks only in terms of p-values says "the result wasn't significant" and stops there, as if nothing was learned.

The second outcome is the one that matters most in public health, where *most* questions don't have the luxury of a clean p<0.05. Someone has to interpret the inconclusive results, too.

## Tooling

This pedagogy is only as good as the tools students have to practice it. When the first software they meet is an intimidating command line with a p-value hidden six menu levels deep, they revert to p-value thinking out of sheer cognitive load. That's part of why I built the [Z-t-Chi Calculator](https://ztchi.hgaladima.com/) — every output page shows the effect size and CI alongside the test statistic and p-value, and every calculator shows its work. Students can check their hand calculations, poke at edge cases, and — most importantly — see a well-designed result page that models the order we're trying to teach.

## What I don't do

A fair objection: "Fine, but what about the students who go on to work somewhere that *only* reports p-values?" That's real. My answer is that I teach them how to read, critique, and explain a p-value — not how to revere one. They leave knowing that a p-value is one tool in a larger kit, and they leave knowing why the ASA told us that.

I also don't pretend this is original. Cumming, GAISE, the ASA statement — all of this is settled-enough consensus that by 2026 it should not be controversial. What's worth writing about is the *implementation*: which tools make it practical, which sequences of topics actually produce the outcome, what assessments reward the right habits.

That's what this blog will be about, among other things.
