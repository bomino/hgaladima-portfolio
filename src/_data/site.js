/**
 * Global site data. Single source of truth for domain, navigation, social
 * links, and identity signals that thread into JSON-LD.
 *
 * Anything marked `UPDATE:` should be replaced by Dr. G before launch.
 */
module.exports = {
    baseUrl: 'https://hgaladima.com',
    name: 'Dr. Hadiza Galadima',
    shortName: 'Hadiza Galadima',
    role: 'Biostatistician · Public Health · Pedagogy',
    tagline: 'UPDATE: your 2-sentence professional tagline — e.g., "Assistant Professor of Biostatistics at Old Dominion University. I teach applied biostatistics to graduate public-health students and build open tools to make statistical reasoning accessible."',
    email: 'UPDATE: your professional email',

    // Identity — these thread into Person JSON-LD sameAs
    identity: {
        orcid: 'UPDATE: 0000-0000-0000-0000',
        scholar: 'UPDATE: https://scholar.google.com/citations?user=YOURID',
        linkedin: 'UPDATE: https://www.linkedin.com/in/hadiza-galadima/',
        odu: 'UPDATE: https://www.odu.edu/directory/people/h/hgaladim',
        github: '',
    },

    affiliation: {
        name: 'Old Dominion University',
        url: 'https://www.odu.edu/',
        department: 'School of Community & Environmental Health',
    },

    nav: [
        { label: 'About', href: '/about/' },
        { label: 'Research', href: '/research/' },
        { label: 'Teaching', href: '/teaching/' },
        { label: 'Blog', href: '/blog/' },
        { label: 'CV', href: '/cv/' },
        { label: 'Contact', href: '/contact/' },
    ],

    related: [
        { label: 'Z-t-Chi Calculator', href: 'https://ztchi.hgaladima.com/', description: 'Free biostatistics calculators I built for teaching.' },
    ],

    buildYear: new Date().getFullYear(),
};
