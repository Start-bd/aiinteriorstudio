import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIGenerator } from '@/components/AIGenerator';
import { Sparkles } from 'lucide-react';

export default function Generate() {
  return (
    <>
      <Helmet>
        <title>Generate Interior Design | AI Interior Design</title>
        <meta name="description" content="Create stunning AI-powered interior designs in seconds. Choose your style, room type, and describe your vision." />
        <link rel="canonical" href="https://interiorofai.com/generate" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-12 px-4">
          <div className="container max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Design</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Generate Your Dream Room
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a style, choose your room type, and let AI create a stunning interior design for you.
              </p>
            </div>
            
            {/* Generator Form */}
            <div className="animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <AIGenerator />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
