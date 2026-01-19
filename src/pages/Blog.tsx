import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { blogPosts, getAllCategories } from "@/lib/blog-data";

const Blog = () => {
  const categories = getAllCategories();

  return (
    <>
      <Helmet>
        <title>Blog | Interior of AI - Design Tips, Guides & Inspiration</title>
        <meta
          name="description"
          content="Explore interior design tips, AI design guides, and inspiring room transformations. Learn how to use AI for stunning home makeovers."
        />
        <meta property="og:title" content="Blog | Interior of AI" />
        <meta
          property="og:description"
          content="Explore interior design tips, AI design guides, and inspiring room transformations."
        />
        <link rel="canonical" href="https://interiorofai.com/blog" />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Blog" }]} />
        </div>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-6 text-center">
            <span className="text-primary uppercase tracking-widest text-sm font-medium">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 mb-6">
              Design Tips & <span className="text-gradient-gold">Inspiration</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the latest in AI interior design, practical guides, and stunning transformation stories
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/blog"
                className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground"
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-video rounded-2xl overflow-hidden bg-secondary">
                <img
                  src={blogPosts[0].featuredImage}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                  width={800}
                  height={450}
                  loading="eager"
                />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-4">
                  Featured Post
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(blogPosts[0].publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {blogPosts[0].readingTime}
                  </div>
                </div>
                <Link to={`/blog/${blogPosts[0].slug}`}>
                  <Button variant="gold" size="lg" className="group">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* All Posts Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-display font-bold mb-10">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={400}
                        height={225}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.readingTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Get Design Tips in Your Inbox
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for weekly inspiration, tutorials, and exclusive design insights.
            </p>
            <Link to="/#newsletter">
              <Button variant="gold" size="lg">
                Subscribe to Newsletter
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Blog;
