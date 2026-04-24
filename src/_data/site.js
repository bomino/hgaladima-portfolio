/**
 * Global site data. Single source of truth for domain, navigation, social
 * links, and identity signals that thread into JSON-LD.
 */
module.exports = {
    baseUrl: 'https://hgaladima.com',
    name: 'Dr. Hadiza Galadima',
    shortName: 'Hadiza Galadima',
    role: 'Biostatistics · Public Health · Pedagogy',
    tagline: 'Associate Professor of Biostatistics at Old Dominion University. Research and teaching at the intersection of statistical methods, public-health disparities, and open educational tools.',
    email: 'hgaladim@odu.edu',

    // Identity — thread into Person JSON-LD sameAs.
    // Items still marked UPDATE: are filtered out of JSON-LD automatically.
    identity: {
        orcid: 'UPDATE: 0000-0000-0000-0000',
        scholar: 'UPDATE: https://scholar.google.com/citations?user=YOURID',
        linkedin: 'UPDATE: https://www.linkedin.com/in/hadiza-galadima/',
        odu: 'https://www.odu.edu/directory/people/h/hgaladim',
        github: '',
    },

    affiliation: {
        name: 'Old Dominion University',
        url: 'https://www.odu.edu/',
        department: 'Department of Epidemiology, Biostatistics, and Environmental Health',
        school: 'Joint School of Public Health',
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
