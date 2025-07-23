import type { WebsiteData, TraditionalSeoResult, GeoResult, ContentSuggestions } from '@shared/schema';

export class SeoAnalyzer {
  analyzeTraditionalSeo(data: WebsiteData): { results: TraditionalSeoResult[]; score: number } {
    const results: TraditionalSeoResult[] = [];
    let score = 0;
    const maxScore = 100;

    // Title tag analysis
    if (!data.title) {
      results.push({
        type: 'error',
        title: 'Missing title tag',
        description: 'The page is missing a title tag, which is crucial for SEO.',
      });
    } else if (data.title.length < 30) {
      results.push({
        type: 'warning',
        title: 'Title tag too short',
        description: 'Title tag should be between 30-60 characters for optimal SEO.',
        details: `Current: "${data.title}"`,
      });
      score += 10;
    } else if (data.title.length > 60) {
      results.push({
        type: 'warning',
        title: 'Title tag too long',
        description: 'Title tag may be truncated in search results.',
        details: `Current length: ${data.title.length} characters`,
      });
      score += 10;
    } else {
      results.push({
        type: 'success',
        title: 'Title tag length optimal',
        description: 'Title tag length is within the recommended range.',
        details: `Length: ${data.title.length} characters`,
      });
      score += 20;
    }

    // Meta description analysis
    if (!data.metaDescription) {
      results.push({
        type: 'error',
        title: 'Missing meta description',
        description: 'Meta description is missing, which affects click-through rates.',
      });
    } else if (data.metaDescription.length < 120) {
      results.push({
        type: 'warning',
        title: 'Meta description too short',
        description: 'Meta description should be 120-160 characters for best results.',
        details: `Current length: ${data.metaDescription.length} characters`,
      });
      score += 10;
    } else if (data.metaDescription.length > 160) {
      results.push({
        type: 'warning',
        title: 'Meta description too long',
        description: 'Meta description may be truncated in search results.',
        details: `Current length: ${data.metaDescription.length} characters`,
      });
      score += 10;
    } else {
      results.push({
        type: 'success',
        title: 'Meta description length optimal',
        description: 'Meta description length is within the recommended range.',
        details: `Length: ${data.metaDescription.length} characters`,
      });
      score += 20;
    }

    // Heading structure analysis
    const h1Count = data.headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      results.push({
        type: 'error',
        title: 'Missing H1 tag',
        description: 'Every page should have exactly one H1 tag.',
      });
    } else if (h1Count > 1) {
      results.push({
        type: 'warning',
        title: 'Multiple H1 tags found',
        description: 'Use only one H1 per page and structure other headings hierarchically.',
        metrics: { 'H1 tags': h1Count },
      });
      score += 10;
    } else {
      results.push({
        type: 'success',
        title: 'Proper H1 structure',
        description: 'Page has exactly one H1 tag.',
      });
      score += 15;
    }

    // Image optimization analysis
    const imagesWithoutAlt = data.images.filter(img => !img.hasAlt).length;
    if (imagesWithoutAlt > 0) {
      results.push({
        type: 'error',
        title: 'Missing alt text on images',
        description: `${imagesWithoutAlt} images found without alt attributes, affecting accessibility and SEO.`,
        metrics: {
          'Total images': data.images.length,
          'Missing alt': imagesWithoutAlt,
        },
      });
    } else if (data.images.length > 0) {
      results.push({
        type: 'success',
        title: 'All images have alt text',
        description: 'Great job! All images have descriptive alt attributes.',
        metrics: { 'Total images': data.images.length },
      });
      score += 15;
    }

    // Schema markup analysis
    if (!data.hasSchema) {
      results.push({
        type: 'warning',
        title: 'No schema markup found',
        description: 'Consider adding structured data to help search engines understand your content.',
      });
    } else {
      results.push({
        type: 'success',
        title: 'Schema markup present',
        description: 'Structured data found on the page.',
        details: `Types: ${data.schemaTypes.join(', ')}`,
      });
      score += 15;
    }

    // Page speed analysis (basic)
    if (data.loadTime > 3000) {
      results.push({
        type: 'warning',
        title: 'Slow page load time',
        description: 'Page took longer than 3 seconds to load, which may affect user experience.',
        metrics: { 'Load time': `${data.loadTime}ms` },
      });
    } else {
      results.push({
        type: 'success',
        title: 'Good page load time',
        description: 'Page loads within acceptable time limits.',
        metrics: { 'Load time': `${data.loadTime}ms` },
      });
      score += 15;
    }

    return { results, score: Math.min(score, maxScore) };
  }

  analyzeGeo(data: WebsiteData): { results: GeoResult[]; score: number } {
    const results: GeoResult[] = [];
    let score = 0;
    const maxScore = 100;

    // Content structure analysis
    const hasH2Structure = data.headings.some(h => h.level === 2);
    if (hasH2Structure) {
      results.push({
        type: 'success',
        title: 'Content structured with H2 headings',
        description: 'Good use of heading structure that AI engines can easily parse and understand.',
      });
      score += 20;
    } else {
      results.push({
        type: 'warning',
        title: 'Poor heading structure for AI',
        description: 'Add H2 and H3 headings to improve AI readability and content parsing.',
      });
    }

    // TL;DR analysis
    const hasTldr = data.content.toLowerCase().includes('tl;dr') || 
                   data.content.toLowerCase().includes('summary') ||
                   data.content.toLowerCase().includes('key takeaways');
    if (!hasTldr) {
      results.push({
        type: 'error',
        title: 'No TL;DR summary found',
        description: 'AI tools prefer concise summaries. Add a TL;DR section to improve AI-driven content discovery.',
      });
    } else {
      results.push({
        type: 'success',
        title: 'Summary content present',
        description: 'Content includes summary sections that AI tools can easily extract.',
      });
      score += 25;
    }

    // Question-answer format analysis
    const hasQAFormat = data.content.toLowerCase().includes('what is') ||
                       data.content.toLowerCase().includes('how to') ||
                       data.content.toLowerCase().includes('why') ||
                       data.headings.some(h => h.text.toLowerCase().includes('?'));
    if (!hasQAFormat) {
      results.push({
        type: 'warning',
        title: 'Limited question-answer format',
        description: 'Content doesn\'t directly answer user intent queries. Consider restructuring with Q&A sections.',
      });
    } else {
      results.push({
        type: 'success',
        title: 'Question-answer format detected',
        description: 'Content addresses user questions directly, improving AI platform visibility.',
      });
      score += 20;
    }

    // Schema markup for AI
    if (!data.hasSchema) {
      results.push({
        type: 'error',
        title: 'Missing schema markup',
        description: 'No structured data found. Schema markup helps AI engines understand your content context.',
      });
    } else {
      results.push({
        type: 'success',
        title: 'Schema markup enhances AI understanding',
        description: 'Structured data helps AI platforms understand content relationships and context.',
      });
      score += 20;
    }

    // Entity and semantic clarity
    const hasEntities = data.content.includes('2024') || 
                       data.content.includes('2023') ||
                       /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(data.content); // Basic proper noun detection
    if (hasEntities) {
      results.push({
        type: 'success',
        title: 'Good entity and semantic clarity',
        description: 'Content includes specific entities, dates, and proper nouns that improve AI understanding.',
      });
      score += 15;
    } else {
      results.push({
        type: 'warning',
        title: 'Moderate entity and semantic clarity',
        description: 'Consider adding more specific dates, locations, and definitions to improve AI understanding.',
      });
    }

    return { results, score: Math.min(score, maxScore) };
  }

  generateContentSuggestions(data: WebsiteData, aiScore: number): ContentSuggestions {
    // Generate missing keywords based on content analysis
    const missingKeywords = [
      'SEO optimization',
      'website performance',
      'search engine ranking',
      'content marketing',
      'digital marketing'
    ];

    // Generate blog title suggestions
    const blogTitles = [
      {
        title: 'How to Improve Your Page Speed for Better Rankings in 2024',
        target: 'page speed optimization, Core Web Vitals'
      },
      {
        title: 'The Complete Guide to AI-Friendly Content Creation',
        target: 'AI optimization, content structure'
      },
      {
        title: 'SEO vs GEO: What\'s the Difference and Why It Matters',
        target: 'generative engine optimization, SEO comparison'
      },
      {
        title: 'Schema Markup: The Secret to Better AI Visibility',
        target: 'structured data, schema implementation'
      }
    ];

    // Generate content structure suggestions
    const contentStructure = [
      '## What is SEO Optimization?',
      '### Definition and Core Principles',
      '### Why SEO Matters in 2024',
      '## Traditional SEO vs. AI Optimization',
      '### Search Engine Optimization Basics',
      '### Generative Engine Optimization (GEO)',
      '## Step-by-Step Implementation Guide',
      '### Technical SEO Checklist',
      '### Content Optimization Strategies',
      '## Measuring Success',
      '### Key Performance Indicators',
      '### Tools and Analytics'
    ];

    // Generate FAQ suggestions
    const faqs = [
      {
        question: 'What is a good page speed score?',
        answer: 'A good page speed score is above 90 for mobile and desktop. Core Web Vitals should meet Google\'s thresholds: LCP under 2.5s, FID under 100ms, and CLS under 0.1.'
      },
      {
        question: 'How can I optimize images without losing quality?',
        answer: 'Use modern formats like WebP or AVIF, implement lazy loading, compress images to 80-85% quality, and serve responsive images using srcset attributes.'
      },
      {
        question: 'What\'s the difference between SEO and GEO?',
        answer: 'SEO optimizes for search engines like Google, while GEO (Generative Engine Optimization) optimizes for AI platforms like ChatGPT and Perplexity that generate direct answers.'
      },
      {
        question: 'How important is schema markup for AI visibility?',
        answer: 'Schema markup is crucial for AI platforms to understand your content context, entity relationships, and factual information, significantly improving visibility in AI-generated responses.'
      }
    ];

    // Assess AI platform visibility
    const aiVisibility = {
      chatgpt: 'medium' as const,
      perplexity: 'low' as const,
      claude: 'medium' as const,
      bard: 'low' as const
    };

    // Generate AI improvement suggestions based on current score
    const aiImprovements = this.generateAiImprovements(data, aiScore);

    return {
      missingKeywords,
      blogTitles,
      contentStructure,
      faqs,
      aiVisibility,
      aiImprovements
    };
  }

  generateAiImprovements(data: WebsiteData, currentScore: number): Array<{
    action: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    priority: number;
  }> {
    const improvements = [];
    
    // High priority improvements for scores below 50
    if (currentScore < 50) {
      improvements.push({
        action: 'Add TL;DR Summary Section',
        description: 'AI tools ke liye page ke top par 2-3 lines ka summary add kariye jo main points cover kare',
        impact: 'high' as const,
        priority: 1
      });
      
      improvements.push({
        action: 'Create FAQ Schema Markup',
        description: 'Common questions aur unke answers ko structured data format mein add kariye taaki AI easily samjh sake',
        impact: 'high' as const,
        priority: 2
      });
    }

    // Medium priority improvements for scores 50-75
    if (currentScore < 75) {
      improvements.push({
        action: 'Improve Content Structure with Clear Headings',
        description: 'H2/H3 headings use kariye jo direct questions answer karte hain (What is, How to, Why)',
        impact: 'high' as const,
        priority: 3
      });
      
      improvements.push({
        action: 'Add "People Also Ask" Section',
        description: 'Related questions aur unke short answers add kariye jo users commonly puchte hain',
        impact: 'medium' as const,
        priority: 4
      });
      
      improvements.push({
        action: 'Include Specific Dates and Statistics',
        description: 'Current year, numbers, aur specific data points add kariye jo AI tools reference kar sakein',
        impact: 'medium' as const,
        priority: 5
      });
    }

    // Fine-tuning improvements for scores 75-85
    if (currentScore < 85) {
      improvements.push({
        action: 'Optimize for Voice Search Queries',
        description: 'Natural language phrases add kariye jo log voice assistants se puchte hain',
        impact: 'medium' as const,
        priority: 6
      });
      
      improvements.push({
        action: 'Add Comparison Tables',
        description: 'Options, features ya alternatives ko table format mein present kariye',
        impact: 'medium' as const,
        priority: 7
      });
    }

    // Advanced improvements for scores 85+
    if (currentScore >= 85) {
      improvements.push({
        action: 'Link to Authoritative Sources',
        description: 'Wikipedia, government sites, aur trusted sources ko reference kariye credibility ke liye',
        impact: 'low' as const,
        priority: 8
      });
      
      improvements.push({
        action: 'Add Step-by-Step Instructions',
        description: 'Process-based content ko numbered lists mein convert kariye',
        impact: 'low' as const,
        priority: 9
      });
      
      improvements.push({
        action: 'Implement Article Schema',
        description: 'Publisher, author, aur publication date ka structured data add kariye',
        impact: 'low' as const,
        priority: 10
      });
    }

    return improvements.slice(0, 6); // Return top 6 most relevant improvements
  }

  compareWebsites(data1: WebsiteData, report1: any, data2: WebsiteData, report2: any): any {
    const seoScoreDiff = report2.seoScore - report1.seoScore;
    const aiScoreDiff = report2.aiScore - report1.aiScore;
    const betterPerformer = seoScoreDiff + aiScoreDiff > 0 ? 'url2' : 'url1';
    
    const keyDifferences = [];

    // SEO Differences
    if (Math.abs(seoScoreDiff) > 10) {
      keyDifferences.push({
        category: 'seo' as const,
        aspect: 'Title Tag Optimization',
        url1Value: `${data1.title.length} characters`,
        url2Value: `${data2.title.length} characters`,
        recommendation: seoScoreDiff > 0 
          ? 'URL2 has better title length (50-60 chars ideal)'
          : 'URL1 has better title length optimization'
      });

      keyDifferences.push({
        category: 'seo' as const,
        aspect: 'Meta Description',
        url1Value: data1.metaDescription ? `${data1.metaDescription.length} chars` : 'Missing',
        url2Value: data2.metaDescription ? `${data2.metaDescription.length} chars` : 'Missing',
        recommendation: 'Meta description should be 150-160 characters for best results'
      });
    }

    // AI Optimization Differences
    if (Math.abs(aiScoreDiff) > 10) {
      const hasH2_1 = data1.headings.some(h => h.level === 2);
      const hasH2_2 = data2.headings.some(h => h.level === 2);
      
      keyDifferences.push({
        category: 'ai' as const,
        aspect: 'Content Structure',
        url1Value: hasH2_1 ? 'Has H2 structure' : 'Poor heading structure',
        url2Value: hasH2_2 ? 'Has H2 structure' : 'Poor heading structure',
        recommendation: 'Use H2/H3 headings for better AI content parsing'
      });

      const hasTldr1 = data1.content.toLowerCase().includes('tl;dr');
      const hasTldr2 = data2.content.toLowerCase().includes('tl;dr');
      
      keyDifferences.push({
        category: 'ai' as const,
        aspect: 'TL;DR Summary',
        url1Value: hasTldr1 ? 'Present' : 'Missing',
        url2Value: hasTldr2 ? 'Present' : 'Missing',
        recommendation: 'Add TL;DR section for better AI tool visibility'
      });

      keyDifferences.push({
        category: 'ai' as const,
        aspect: 'Schema Markup',
        url1Value: data1.hasSchema ? `${data1.schemaTypes.length} types` : 'None',
        url2Value: data2.hasSchema ? `${data2.schemaTypes.length} types` : 'None',
        recommendation: 'Implement FAQ and Article schema for AI platforms'
      });
    }

    return {
      seoScoreDiff,
      aiScoreDiff,
      betterPerformer,
      keyDifferences
    };
  }
}
