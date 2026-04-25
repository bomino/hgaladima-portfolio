const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
    eleventyConfig.addPassthroughCopy({ 'src/admin': 'admin' });
    eleventyConfig.addPassthroughCopy('src/favicon.ico');

    eleventyConfig.setLibrary(
        'md',
        markdownIt({ html: true, linkify: true, typographer: true }).use(markdownItAnchor, {
            permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
            level: [2, 3],
        })
    );

    eleventyConfig.addFilter('isoDate', (value) => {
        const d = value instanceof Date ? value : new Date(value);
        return d.toISOString();
    });

    eleventyConfig.addFilter('readableDate', (value) => {
        const d = value instanceof Date ? value : new Date(value);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    });

    eleventyConfig.addFilter('year', (value) => {
        const d = value instanceof Date ? value : new Date(value);
        return String(d.getUTCFullYear());
    });

    // Split an array of {date: "YYYY-MM-DD", ...} entries into three buckets
    // by date at build time. Upcoming ascending; recent/archive descending.
    // Cutoff for "recent" is the start of the year three years before now.
    eleventyConfig.addFilter('groupTalksByRecency', function (talks) {
        const now = new Date();
        const recentCutoff = new Date(now.getUTCFullYear() - 3, 0, 1);
        const buckets = { upcoming: [], recent: [], archive: [] };
        (talks || []).forEach((t) => {
            const d = new Date(t.date);
            if (d > now) buckets.upcoming.push(t);
            else if (d >= recentCutoff) buckets.recent.push(t);
            else buckets.archive.push(t);
        });
        buckets.upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        buckets.recent.sort((a, b) => new Date(b.date) - new Date(a.date));
        buckets.archive.sort((a, b) => new Date(b.date) - new Date(a.date));
        return buckets;
    });

    eleventyConfig.addCollection('posts', (collection) =>
        collection
            .getFilteredByGlob('src/blog/*.md')
            .filter((item) => !item.data.draft)
            .sort((a, b) => b.date - a.date)
    );

    return {
        dir: {
            input: 'src',
            includes: '_includes',
            data: '_data',
            output: '_site',
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        templateFormats: ['njk', 'md', '11ty.js'],
    };
};
