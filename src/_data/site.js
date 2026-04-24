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
    email: 'info@hgaladima.com',

    // Identity — thread into Person JSON-LD sameAs for Google's Knowledge
    // Graph. Each populated value strengthens the entity linkage between
    // hgaladima.com and her publication / profile records across platforms.
    identity: {
        orcid: '0000-0003-1588-3929',
        scholar: 'https://scholar.google.com/citations?hl=en&user=G7In2sYAAAAJ',
        linkedin: 'https://www.linkedin.com/in/hadizagaladima/',
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
