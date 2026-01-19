import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Clock, Tag, Twitter, Linkedin, Facebook } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getBlogPost, getRecentPosts } from "@/lib/blog-data";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;
  const recentPosts = getRecentPosts(3).filter(p => p.slug !== slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const shareUrl = `https://interiorofai.com/blog/${post.slug}`;
  const shareText = `${post.title} - Interior of AI`;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Interior of AI Blog</title>
        <meta name="description" content={post.metaDescription} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content={`https://interiorofai.com${post.featuredImage}`} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <link rel="canonical" href={shareUrl} />
        
        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.metaDescription,
            "image": `https://interiorofai.com${post.featuredImage}`,
            "author": {
              "@type": "Organization",
              "name": post.author,
              "url": "https://interiorofai.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Interior of AI",
              "logo": {
                "@type": "ImageObject",
                "url": "https://interiorofai.com/og-image.jpg"
              }
            },
            "datePublished": post.publishedAt,
            "dateModified": post.publishedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": shareUrl
            }
          })}
        </script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background pt-24">
        {/* Back Navigation */}
        <div className="container mx-auto px-6 py-6">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-6 max-w-4xl">
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold">
                  AI
                </div>
                <div>
                  <div className="font-medium">{post.author}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Share:</span>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-12">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
              width={1200}
              height={675}
              loading="eager"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content) }}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 py-8 border-t border-b border-border mb-12">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Try our AI interior design tool and see your room transformed in seconds. Free to start!
            </p>
            <Link to="/#ai-generator">
              <Button variant="gold" size="lg">
                Start Your Free Design
              </Button>
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        {recentPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-display font-bold mb-10">Continue Reading</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {recentPosts.slice(0, 2).map((relatedPost) => (
                  <article
                    key={relatedPost.slug}
                    className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
                  >
                    <Link to={`/blog/${relatedPost.slug}`}>
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          width={400}
                          height={225}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-xs text-primary font-medium">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-lg font-display font-semibold mt-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>

      {/* Blog Content Styles */}
      <style>{`
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }
        .blog-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: hsl(var(--foreground));
        }
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: hsl(var(--muted-foreground));
        }
        .blog-content strong {
          color: hsl(var(--foreground));
          font-weight: 600;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          color: hsl(var(--muted-foreground));
        }
        .blog-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .blog-content a:hover {
          opacity: 0.8;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 2.5rem 0;
        }
        .blog-content blockquote {
          border-left: 3px solid hsl(var(--primary));
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </>
  );
};

// Simple markdown to HTML converter for our blog content
function formatMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Horizontal rules
    .replace(/^---$/gim, '<hr>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Wrap list items
    .replace(/(<li>.*<\/li>)/gs, (match) => `<ul>${match}</ul>`)
    // Fix multiple ul tags
    .replace(/<\/ul>\s*<ul>/g, '')
    // Wrap in paragraphs
    .replace(/^(?!<[h|u|o|l|p|hr])(.+)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '');
}

export default BlogPost;
