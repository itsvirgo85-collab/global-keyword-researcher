import { ContentBrief } from "@/types";

export interface GeneratedArticle {
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  targetWordCount: number;
  markdownContent: string;
  htmlContent: string;
  faqSchemaJson: string;
}

export function generateFullSeoArticle(brief: ContentBrief): GeneratedArticle {
  const kw = brief.keyword;
  const title = brief.targetHeadings.h1;
  const currentYear = new Date().getFullYear();

  const metaTitle = `${title} | Complete Guide`;
  const metaDescription = `Master ${kw} with our complete ${currentYear} guide. Discover step-by-step frameworks, best practices, expert tips, and common pitfalls to avoid.`;

  // Construct Markdown
  let md = `# ${title}\n\n`;
  md += `> **Quick Summary:** In this comprehensive ${currentYear} guide, we break down everything you need to know about **${kw}**, providing actionable frameworks, real-world examples, and expert strategies to achieve measurable success.\n\n`;

  md += `## Table of Contents\n`;
  brief.targetHeadings.h2.forEach((h2, idx) => {
    md += `${idx + 1}. [${h2}](#${slugify(h2)})\n`;
  });
  md += `\n---\n\n`;

  // Section 1: Intro
  md += `## ${brief.targetHeadings.h2[0]}\n\n`;
  md += `In today's fast-evolving landscape, understanding **${kw}** has become more critical than ever. Whether you are an industry professional, business owner, or enthusiast seeking to stay ahead of the curve, having a clear and tactical roadmap is essential.\n\n`;
  md += `Many organizations and practitioners struggle with common bottlenecks when approaching this topic. The fundamental goal of this guide is to strip away the fluff and give you clear, tested insights that produce real outcomes.\n\n`;

  // Section 2: Core Fundamentals
  if (brief.targetHeadings.h2.length > 1) {
    md += `## ${brief.targetHeadings.h2[1]}\n\n`;
    md += `Before diving into execution, it is paramount to understand the core foundational principles of ${kw}. At its heart, success relies on three critical pillars:\n\n`;
    md += `- **Consistency & Quality:** Ensuring every step is executed with precision rather than shortcuts.\n`;
    md += `- **Data-Driven Decision Making:** Tracking key performance indicators rather than relying on guesswork.\n`;
    md += `- **Scalability & Sustainability:** Building frameworks that remain effective long after initial implementation.\n\n`;
    md += `When these three pillars align, achieving superior results becomes predictable and repeatable.\n\n`;
  }

  // Section 3: Detailed Breakdown & Steps
  if (brief.targetHeadings.h2.length > 2) {
    md += `## ${brief.targetHeadings.h2[2]}\n\n`;
    md += `Here is how leading industry experts approach ${kw} in practical scenarios:\n\n`;

    if (brief.targetHeadings.h3 && brief.targetHeadings.h3.length > 0) {
      brief.targetHeadings.h3.forEach((h3) => {
        md += `### ${h3}\n\n`;
        md += `When executing this specific stage, prioritize clarity and attention to detail. Key elements to focus on include:\n\n`;
        md += `1. Establishing baseline metrics before making alterations.\n`;
        md += `2. Utilizing modern tooling to streamline routine bottlenecks.\n`;
        md += `3. Conducting regular periodic audits to ensure optimal performance.\n\n`;
      });
    } else {
      md += `1. **Phase 1: Research & Discovery:** Identify your primary objectives and audit existing assets.\n`;
      md += `2. **Phase 2: Structured Execution:** Implement your core strategy using standardized industry benchmarks.\n`;
      md += `3. **Phase 3: Measurement & Iteration:** Continuously review analytics to refine and improve your processes.\n\n`;
    }
  }

  // Common Mistakes Section
  md += `## Common Mistakes to Avoid\n\n`;
  md += `Even experienced operators often fall into common traps when working with ${kw}. Keep an eye out for these frequent mistakes:\n\n`;
  md += `- **Overcomplicating the Initial Setup:** Focus on nailing the fundamentals before attempting complex configurations.\n`;
  md += `- **Ignoring Feedback Loops:** Regularly test and validate results against real user behavior.\n`;
  md += `- **Inconsistent Application:** Momentum is key; erratic efforts rarely produce lasting benefits.\n\n`;

  // FAQ Section
  md += `## Frequently Asked Questions (FAQs)\n\n`;
  brief.frequentlyAskedQuestions.forEach((faq) => {
    md += `### ${faq}\n\n`;
    md += `To address this question effectively: Success begins with an honest assessment of your current workflow. Most users find that applying structured, standardized guidelines saves significant time while preventing costly errors. Begin by focusing on key leverage points and expand systematically.\n\n`;
  });

  // Conclusion
  md += `## Final Thoughts & Next Steps\n\n`;
  md += `Mastering **${kw}** is a progressive journey rather than an overnight milestone. By implementing the actionable insights outlined in this guide, you now possess a proven blueprint to achieve your goals with confidence.\n\n`;
  md += `**Ready to get started?** Choose one actionable insight from this guide, apply it today, and measure your results!\n`;

  // FAQ Schema JSON-LD
  const schemaObj = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: brief.frequentlyAskedQuestions.map((q) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Structured answer and practical guidance covering ${q} for optimal results.`,
      },
    })),
  };

  const words = md.split(/\s+/).filter(Boolean);

  return {
    keyword: kw,
    metaTitle,
    metaDescription,
    targetWordCount: words.length,
    markdownContent: md,
    htmlContent: md.replace(/\n\n/g, "<br/><br/>"),
    faqSchemaJson: JSON.stringify(schemaObj, null, 2),
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}
