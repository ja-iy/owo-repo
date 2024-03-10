/** @type {import('@repo/next-sitemap/@server/config')} */
const { nextSiteMapConfig } = require('@repo/next-sitemap/@server/config')


module.exports = nextSiteMapConfig({
    serverSitemapPath: '/server-sitemap.xml',
    exclude_pages: [
        '/admin*',
        '/cms*',
        '/api*',
        '/not-found',
        '/page-not-found',
        '/test*',
    ],
    sitemap_exclude_pages: [
        '/news/article/*',
        '/documents/*',
    ],
    allow_pages: [
        ''
    ]
}, { })



 

/*
    What This file does:
        - Generates a sitemap.xml file ( used for SEO purposes )
        - Generates a robots.txt file ( used for SEO purposes )

    Robots.txt
        Purposes:
            - Tells search engines what to index and what not to index (file path or url parameters to block)
            - Ensuring important pages are crawled more often
            - Prevents search engines from crawling certain file types (e.g. images, .pdf, .doc, .xls, .exe, .zip, etc.)
            - Prevent Bloating crawl budget by disallowing certain pages
            - Prevent duplicate content by disallowing certain pages, 
            - Prevent server overload from search engine bots
            - Specify the location of your XML sitemap

        Syntax:

            - User-agent: * [user-agent name] (specifies specific search engine bot, e.g. Googlebot, Bingbot, etc.)
                - a bot will read the user agents and only follow the rules for the user agent that matches it, if it is not specified, it will follow the rules for all bots

            - Disallow: [URL string not to be crawled] e.g. * /feed/
                - specifies a file path or url parameter to block from being crawled by search engines
                - can use wildcards to block multiple pages, e.g. * /feed/ will block all pages that contain /feed/ in the url
                - can use $ to block a specific file type, e.g. *.pdf$ will block all pdf files
                - can only use one disallow per line, but can have multiple disallow lines

            - Allow: [URL string to be crawled] e.g. /feed/$
                - specifies a file path or url parameter to allow to be crawled by search engines
                - can use wildcards to allow multiple pages, e.g. /feed/ will allow all pages that contain /feed/ in the url
                - can use $ to allow a specific file type, e.g. *.pdf$ will allow all pdf files
                - allows a previously disallowed page to be crawled, can use to override a disallow rule for a specific subfolder or file type

            - Crawl-delay: [number of seconds] e.g. 10
                - specifies the number of seconds to wait between each request to the server
                - can be used to prevent server overload from search engine bots

            - Sitemap: [URL to sitemap] e.g. https://example.com/sitemap.xml
                - specifies the location of your XML sitemap
                - can have multiple sitemap lines
                - can be used to specify multiple sitemaps for different languages
                - can be used to specify multiple sitemaps for different subdomains

            Operators:
                - / (slash) - file path separator, separates directories and subdirectories (includes all things in only the directory after the slash)
                - * (asterisk) - matches zero or more instances of the element preceding it (matches any sequence of characters)
                - $ (dollar sign) - matches the end of the URL string (restricts the match to the end of the URL string)
                
            Groups:
                - a robot.txt file consists of multiple groups
                - each group consists of a user-agent line and one or more disallow/allow lines
                - each group is separated by a blank line
                - each group is read by search engine bots in order from top to bottom
                - each disallow/allow line should be its own line, but can have multiple disallow/allow lines per group
                - do not split a disallow/allow line into multiple lines, it will be read as a separate disallow/allow line
                - every rule must be on its own line

            Defaults:
                - by default all search engine bots will crawl all pages on your site
                - by default all search engine bots will crawl your site as quickly as possible
                - by default all search engine bots will crawl your site as often as possible
                - by default all search engine bots will crawl your site as deeply as possible
                - by default all search engine bots will crawl your site as many times as possible
                
            Common Use Cases:
                - prevent duplicate content and bloating crawl budget by disallowing paginated pages e.g. * /page/*
                - prevent duplicate content and bloating crawl budget by disallowing tag pages e.g. /tag/*
                - prevent duplicate content and bloating crawl budget by disallowing filter pages e.g. *?filter=*
                - prevent duplicate content and bloating crawl budget by disallowing internal search pages e.g. *?s=*
                - prevent access to admin ui pages e.g. /admin/*
                - prevent access to file type pages e.g. *.pdf$
*/