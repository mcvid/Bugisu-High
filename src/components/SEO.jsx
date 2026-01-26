import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, article, url, schema }) => {
    const siteTitle = 'Bugisu High School';
    const siteDescription = 'Excellence, Integrity, and Service - Nurturing the leaders of tomorrow through holistic education and moral values in Mbale, Uganda.';
    const siteUrl = 'https://bugisuunitedfc.com'; // Use production URL or window.location.origin
    const defaultImage = `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600`; // High-quality Campus Shot

    const seo = {
        title: title ? `${title} | ${siteTitle}` : siteTitle,
        description: description || siteDescription,
        image: image || defaultImage,
        url: `${siteUrl}${url || ''}`,
    };

    // Default School Schema
    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "School",
        "name": "Bugisu High School",
        "url": "https://bugisuunitedfc.com",
        "logo": `${siteUrl}/logo.png`,
        "image": defaultImage,
        "description": siteDescription,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Mbale",
            "addressRegion": "Eastern Region",
            "addressCountry": "Uganda"
        }
    };

    const finalSchema = schema || (url === '/' ? defaultSchema : null);

    return (
        <Helmet>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />

            {/* OpenGraph tags */}
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:url" content={seo.url} />
            <meta property="og:type" content={article ? 'article' : 'website'} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />

            {/* Schema.org JSON-LD */}
            {finalSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(finalSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
