import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPostProps {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  metaDescription: string;
  slug: string;
  relatedPosts?: Array<{ slug: string; title: string; excerpt: string }>;
}

const BlogPostPage = ({ post }: { post: BlogPostProps }) => {
  return (
    <>
      <Helmet>
        <title>{post.title} | Interior of AI</title>
        <meta name="description" content={post.metaDescription} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://interiorofai.com/blog/${post.slug}`} />
        <meta property="og:image" content={`https://interiorofai.com${post.featuredImage}`} />
        <meta property="article:author" content="Interior of AI Team" />
        <meta property="article:published_time" content={post.publishedAt} />
        <link rel="canonical" href={`https://interiorofai.com/blog/${post.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Interior of AI Team" />
        <meta name="language" content="English" />
        <meta name="theme-color" content="#050505" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 pb-8">
          <div className="text-sm text-white/40">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <Link to="/blog" className="hover:text-gold transition-colors">Blog</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/60">{post.category}</span>
          </div>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-6 max-w-4xl">
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gold/20 text-gold">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-8 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <span className="text-gold font-display font-bold text-lg">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{post.author}</p>
                <p className="text-sm text-white/40">Author of {post.title}</p>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none leading-relaxed text-white/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-gold/20 text-white/70 hover:text-gold transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </article>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-display font-bold">
                More <span className="text-gradient-gold">Reads</span>
              </h2>
              <p className="text-white/50 mt-2">
                Continue your reading journey with these related articles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group bg-[#141414] border border-white/5 rounded-xl p-6 hover:border-gold/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                      {related.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2 group-hover:text-gold transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-4 line-clamp-2">
                    {related.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span>{new Date(related.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>·</span>
                    <span>{related.readingTime}</span>
                    <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="mt-16 bg-[#050505] rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
            Loved this article?
          </h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            Get more interior design tips and AI inspiration delivered to your inbox.
          </p>
          <Link to="/newsletter">
            <Button variant="gold-outline">
              Subscribe to Our Newsletter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BlogPostPage;
