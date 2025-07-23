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

  analyzeAiPlatformVisibility(data: WebsiteData): any {
    const factors = [];
    let totalScore = 0;
    const maxScore = 1200; // 12 factors × 100 points each

    // 1. Crawlability Assessment
    const crawlabilityScore = this.assessCrawlability(data);
    factors.push({
      factor: 'Public Crawlability',
      score: crawlabilityScore,
      description: 'Page accessibility for AI crawlers without login walls or blocking',
      status: crawlabilityScore >= 80 ? 'pass' : crawlabilityScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += crawlabilityScore;

    // 2. HTML Structure Quality
    const structureScore = this.assessHtmlStructure(data);
    factors.push({
      factor: 'HTML Structure',
      score: structureScore,
      description: 'Clean semantic HTML with proper heading hierarchy',
      status: structureScore >= 80 ? 'pass' : structureScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += structureScore;

    // 3. Content Clarity and Organization
    const clarityScore = this.assessContentClarity(data);
    factors.push({
      factor: 'Content Clarity',
      score: clarityScore,
      description: 'Clear introduction, topic definition, and direct question answers',
      status: clarityScore >= 80 ? 'pass' : clarityScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += clarityScore;

    // 4. Scannable Content Format
    const scannabilityScore = this.assessScanability(data);
    factors.push({
      factor: 'Content Scannability',
      score: scannabilityScore,
      description: 'Short paragraphs and easy-to-summarize content structure',
      status: scannabilityScore >= 80 ? 'pass' : scannabilityScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += scannabilityScore;

    // 5. Summary Sections
    const summaryScore = this.assessSummarySections(data);
    factors.push({
      factor: 'TL;DR & Summary',
      score: summaryScore,
      description: 'Quick summary sections at top or bottom of content',
      status: summaryScore >= 80 ? 'pass' : summaryScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += summaryScore;

    // 6. Q&A Format Content
    const qaScore = this.assessQaFormat(data);
    factors.push({
      factor: 'Q&A Format',
      score: qaScore,
      description: 'Structured question-answer blocks that AI can easily extract',
      status: qaScore >= 80 ? 'pass' : qaScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += qaScore;

    // 7. Schema Markup Implementation
    const schemaScore = this.assessSchemaMarkup(data);
    factors.push({
      factor: 'Schema Markup',
      score: schemaScore,
      description: 'FAQPage, HowTo, Article, and other relevant structured data',
      status: schemaScore >= 80 ? 'pass' : schemaScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += schemaScore;

    // 8. Trusted Entity References
    const entityScore = this.assessTrustedEntities(data);
    factors.push({
      factor: 'Trusted Entities',
      score: entityScore,
      description: 'References to organizations, authority sources, and credible links',
      status: entityScore >= 80 ? 'pass' : entityScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += entityScore;

    // 9. Extractable Data Formats
    const dataScore = this.assessDataFormats(data);
    factors.push({
      factor: 'Data Extraction',
      score: dataScore,
      description: 'Bullet lists, tables, statistics, and structured information',
      status: dataScore >= 80 ? 'pass' : dataScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += dataScore;

    // 10. Reading Level and Clarity
    const readabilityScore = this.assessReadability(data);
    factors.push({
      factor: 'Readability Level',
      score: readabilityScore,
      description: '8th-grade reading level, minimal jargon and marketing fluff',
      status: readabilityScore >= 80 ? 'pass' : readabilityScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += readabilityScore;

    // 11. Freshness Signals
    const freshnessScore = this.assessFreshness(data);
    factors.push({
      factor: 'Content Freshness',
      score: freshnessScore,
      description: 'Updated dates, current year references, and freshness indicators',
      status: freshnessScore >= 80 ? 'pass' : freshnessScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += freshnessScore;

    // 12. Credibility Markers
    const credibilityScore = this.assessCredibility(data);
    factors.push({
      factor: 'Credibility Markers',
      score: credibilityScore,
      description: 'Author information, contact details, and about us content',
      status: credibilityScore >= 80 ? 'pass' : credibilityScore >= 50 ? 'warning' : 'fail'
    });
    totalScore += credibilityScore;

    const overallScore = Math.round((totalScore / maxScore) * 100);
    
    // Generate summary
    const failingFactors = factors.filter(f => f.status === 'fail').length;
    const warningFactors = factors.filter(f => f.status === 'warning').length;
    
    let summary = '';
    if (overallScore >= 80) {
      summary = 'Excellent AI platform visibility with strong optimization across most factors';
    } else if (overallScore >= 60) {
      summary = `Good AI visibility with ${failingFactors + warningFactors} areas needing improvement`;
    } else if (overallScore >= 40) {
      summary = `Moderate AI visibility. ${failingFactors} critical issues and ${warningFactors} warnings to address`;
    } else {
      summary = `Poor AI platform visibility. Significant optimization needed across ${failingFactors} critical areas`;
    }

    // Generate recommendations
    const recommendations = this.generateAiVisibilityRecommendations(factors, overallScore);

    return {
      overallScore,
      summary,
      factors,
      recommendations
    };
  }

  private assessCrawlability(data: WebsiteData): number {
    // Basic crawlability assessment - in real implementation would check robots.txt, meta tags, etc.
    let score = 80; // Base score assuming public access
    
    // Check for potential blocking indicators in content
    if (data.content.toLowerCase().includes('login') || data.content.toLowerCase().includes('sign in')) {
      score -= 20;
    }
    
    return Math.max(0, score);
  }

  private assessHtmlStructure(data: WebsiteData): number {
    let score = 0;
    
    // Check for single H1
    const h1Count = data.headings.filter(h => h.level === 1).length;
    if (h1Count === 1) score += 25;
    else if (h1Count === 0) score += 0;
    else score += 10; // Multiple H1s are not ideal
    
    // Check for proper heading hierarchy
    const hasH2 = data.headings.some(h => h.level === 2);
    const hasH3 = data.headings.some(h => h.level === 3);
    if (hasH2) score += 25;
    if (hasH3) score += 15;
    
    // Basic structure bonus
    if (data.title && data.title.length > 10) score += 20;
    if (data.metaDescription && data.metaDescription.length > 50) score += 15;
    
    return Math.min(100, score);
  }

  private assessContentClarity(data: WebsiteData): number {
    let score = 0;
    const content = data.content.toLowerCase();
    
    // Check for clear introduction patterns
    if (content.includes('what is') || content.includes('introduction') || content.includes('overview')) {
      score += 25;
    }
    
    // Check for question-answering patterns
    if (content.includes('how to') || content.includes('why') || content.includes('when')) {
      score += 25;
    }
    
    // Check for definition patterns
    if (content.includes('definition') || content.includes('means') || content.includes('refers to')) {
      score += 20;
    }
    
    // Content length check
    if (data.wordCount > 300 && data.wordCount < 3000) {
      score += 30;
    } else if (data.wordCount >= 3000) {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  private assessScanability(data: WebsiteData): number {
    let score = 0;
    const content = data.content;
    
    // Estimate paragraph structure (simple heuristic)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
    
    if (avgParagraphLength < 300) score += 40; // Short paragraphs
    else if (avgParagraphLength < 500) score += 25;
    else score += 10;
    
    // Check for bullet points or lists
    if (content.includes('•') || content.includes('*') || content.includes('1.') || content.includes('-')) {
      score += 30;
    }
    
    // Check for clear section breaks
    if (data.headings.length > 3) {
      score += 30;
    }
    
    return Math.min(100, score);
  }

  private assessSummarySections(data: WebsiteData): number {
    const content = data.content.toLowerCase();
    let score = 0;
    
    // Check for TL;DR
    if (content.includes('tl;dr') || content.includes('tldr')) score += 40;
    
    // Check for summary indicators
    if (content.includes('summary') || content.includes('key points') || content.includes('takeaways')) {
      score += 30;
    }
    
    // Check for conclusion
    if (content.includes('conclusion') || content.includes('to summarize')) {
      score += 30;
    }
    
    return Math.min(100, score);
  }

  private assessQaFormat(data: WebsiteData): number {
    const content = data.content.toLowerCase();
    let score = 0;
    
    // Check for Q&A patterns
    if (content.includes('q:') || content.includes('question:') || content.includes('faq')) {
      score += 40;
    }
    
    // Check for answer patterns
    if (content.includes('a:') || content.includes('answer:')) {
      score += 30;
    }
    
    // Check for question headings
    const questionHeadings = data.headings.filter(h => 
      h.text.toLowerCase().includes('?') || 
      h.text.toLowerCase().startsWith('how ') ||
      h.text.toLowerCase().startsWith('what ') ||
      h.text.toLowerCase().startsWith('why ')
    );
    
    if (questionHeadings.length > 0) {
      score += 30;
    }
    
    return Math.min(100, score);
  }

  private assessSchemaMarkup(data: WebsiteData): number {
    let score = 0;
    
    if (data.hasSchema) {
      score += 50;
      
      // Bonus for specific schema types
      if (data.schemaTypes.includes('FAQPage')) score += 20;
      if (data.schemaTypes.includes('Article')) score += 15;
      if (data.schemaTypes.includes('HowTo')) score += 15;
    }
    
    return Math.min(100, score);
  }

  private assessTrustedEntities(data: WebsiteData): number {
    let score = 0;
    const content = data.content.toLowerCase();
    
    // Check for authority domain references
    if (content.includes('wikipedia') || content.includes('.gov') || content.includes('.edu')) {
      score += 30;
    }
    
    // Check for organization mentions
    if (content.includes('research') || content.includes('study') || content.includes('university')) {
      score += 25;
    }
    
    // Check for external links (basic heuristic)
    const externalLinks = data.links.filter(link => !link.isInternal);
    if (externalLinks.length > 2) score += 25;
    if (externalLinks.length > 5) score += 20;
    
    return Math.min(100, score);
  }

  private assessDataFormats(data: WebsiteData): number {
    let score = 0;
    const content = data.content;
    
    // Check for bullet points
    if (content.includes('•') || content.includes('*') || content.match(/^\s*[-\*\+]/m)) {
      score += 30;
    }
    
    // Check for numbered lists
    if (content.match(/^\s*\d+\./m)) {
      score += 25;
    }
    
    // Check for statistical data
    if (content.match(/\d+%/) || content.match(/\$\d+/) || content.match(/\d+,\d+/)) {
      score += 25;
    }
    
    // Tables would be checked in real HTML parsing
    score += 20; // Base score for basic formatting
    
    return Math.min(100, score);
  }

  private assessReadability(data: WebsiteData): number {
    let score = 60; // Base readability score
    
    // Simple readability heuristics
    const avgWordsPerSentence = data.wordCount / (data.content.split('.').length || 1);
    
    if (avgWordsPerSentence < 15) score += 25;
    else if (avgWordsPerSentence < 20) score += 15;
    else score += 5;
    
    // Check for jargon indicators (overly complex words)
    const complexWords = data.content.match(/\w{10,}/g) || [];
    const complexWordRatio = complexWords.length / data.wordCount;
    
    if (complexWordRatio < 0.05) score += 15;
    else if (complexWordRatio < 0.1) score += 10;
    
    return Math.min(100, score);
  }

  private assessFreshness(data: WebsiteData): number {
    let score = 0;
    const content = data.content.toLowerCase();
    const currentYear = new Date().getFullYear();
    
    // Check for current year
    if (content.includes(currentYear.toString())) score += 40;
    if (content.includes((currentYear - 1).toString())) score += 20;
    
    // Check for freshness indicators
    if (content.includes('updated') || content.includes('revised') || content.includes('latest')) {
      score += 30;
    }
    
    // Check for recent dates
    if (content.includes('2024') || content.includes('2025')) {
      score += 30;
    }
    
    return Math.min(100, score);
  }

  private assessCredibility(data: WebsiteData): number {
    let score = 40; // Base score
    const content = data.content.toLowerCase();
    
    // Check for author information
    if (content.includes('author') || content.includes('written by') || content.includes('by:')) {
      score += 25;
    }
    
    // Check for contact information
    if (content.includes('contact') || content.includes('about us') || content.includes('team')) {
      score += 20;
    }
    
    // Check for credentials
    if (content.includes('expert') || content.includes('certified') || content.includes('professional')) {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  private generateAiVisibilityRecommendations(factors: any[], overallScore: number): any[] {
    const recommendations = [];
    
    // High priority recommendations for critical failures
    factors.forEach(factor => {
      if (factor.status === 'fail') {
        switch (factor.factor) {
          case 'TL;DR & Summary':
            recommendations.push({
              priority: 'high',
              action: 'Add TL;DR Summary Section',
              description: 'Page ke top या bottom में 2-3 sentences का clear summary add करें जो main points cover करे',
              impact: 'AI tools आपका content easily समझ और summarize कर पाएंगे'
            });
            break;
          case 'Q&A Format':
            recommendations.push({
              priority: 'high',
              action: 'Create FAQ Section',
              description: 'Common questions और उनके direct answers add करें structured format में',
              impact: 'ChatGPT और Perplexity में better visibility मिलेगी'
            });
            break;
          case 'Schema Markup':
            recommendations.push({
              priority: 'high',
              action: 'Implement Structured Data',
              description: 'FAQPage, Article, या HowTo schema markup add करें',
              impact: 'AI platforms को content का context better समझ आएगा'
            });
            break;
        }
      }
    });
    
    // Medium priority for warnings
    factors.forEach(factor => {
      if (factor.status === 'warning') {
        switch (factor.factor) {
          case 'HTML Structure':
            recommendations.push({
              priority: 'medium',
              action: 'Improve Heading Structure',
              description: 'Single H1 use करें और proper H2/H3 hierarchy बनाएं',
              impact: 'Content का logical flow AI को better समझ आएगा'
            });
            break;
          case 'Content Scannability':
            recommendations.push({
              priority: 'medium',
              action: 'Break Content into Short Paragraphs',
              description: 'Long paragraphs को छोटे में divide करें और bullet points use करें',
              impact: 'AI tools content को easily scan और extract कर पाएंगे'
            });
            break;
        }
      }
    });
    
    // General recommendations based on score
    if (overallScore < 70) {
      recommendations.push({
        priority: 'medium',
        action: 'Add Current Year References',
        description: '2025 और recent data points include करें content freshness के लिए',
        impact: 'AI platforms fresh और relevant content को prefer करते हैं'
      });
    }
    
    return recommendations.slice(0, 8); // Return top 8 recommendations
  }

  compareWebsites(data1: WebsiteData, report1: any, data2: WebsiteData, report2: any, 
                  aiVisibility1: any, aiVisibility2: any): any {
    const seoScoreDiff = report2.seoScore - report1.seoScore;
    const aiScoreDiff = report2.aiScore - report1.aiScore;
    const aiVisibilityDiff = aiVisibility2.overallScore - aiVisibility1.overallScore;
    const betterPerformer = (seoScoreDiff + aiScoreDiff + aiVisibilityDiff) > 0 ? 'url2' : 'url1';
    
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

    // AI Platform Visibility Differences
    if (Math.abs(aiVisibilityDiff) > 15) {
      const factor1 = aiVisibility1.factors.find((f: any) => f.factor === 'TL;DR & Summary');
      const factor2 = aiVisibility2.factors.find((f: any) => f.factor === 'TL;DR & Summary');
      
      keyDifferences.push({
        category: 'visibility' as const,
        aspect: 'AI Platform Summary',
        url1Value: factor1 ? `${factor1.score}/100` : 'Not assessed',
        url2Value: factor2 ? `${factor2.score}/100` : 'Not assessed',
        recommendation: 'Add TL;DR sections और clear summaries for better AI visibility'
      });

      const schema1 = aiVisibility1.factors.find((f: any) => f.factor === 'Schema Markup');
      const schema2 = aiVisibility2.factors.find((f: any) => f.factor === 'Schema Markup');
      
      keyDifferences.push({
        category: 'visibility' as const,
        aspect: 'Structured Data Implementation',
        url1Value: schema1 ? `${schema1.score}/100` : 'Not assessed',
        url2Value: schema2 ? `${schema2.score}/100` : 'Not assessed',
        recommendation: 'Implement FAQPage और Article schema markup for AI platforms'
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
      aiVisibilityDiff,
      betterPerformer,
      keyDifferences
    };
  }
}
