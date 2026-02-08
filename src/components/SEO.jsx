import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSchool } from '../contexts/SchoolContext';

const SEO = ({ title, description, image, article, url, schema }) => {
    const { school } = useSchool();
    const siteTitle = school?.name || 'Bugisu High School';
    const siteDescription = school?.description || 'Excellence, Integrity, and Service - Nurturing the leaders of tomorrow through holistic education and moral values.';
    const siteUrl = window.location.origin;
    const defaultImage = school?.logo_url || `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1600`;

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
        "name": siteTitle,
        "url": siteUrl,
        "logo": school?.logo_url || `${siteUrl}/logo.png`,
        "image": defaultImage,
        "description": siteDescription,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": school?.address || "Mbale",
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
