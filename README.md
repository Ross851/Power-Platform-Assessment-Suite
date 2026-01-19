# Power Platform Assessment Suite

A comprehensive assessment tool for evaluating Power Platform maturity against Microsoft best practices.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/rosshastie85-8737s-projects/v0-image-analysis)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## 🎯 Overview

The Power Platform Assessment Suite helps organizations evaluate their Power Platform maturity across 10 key areas:

- **Documentation & Rulebooks Review** - Central repository and governance documentation
- **DLP Policy Assessment** - Data Loss Prevention policies and effectiveness
- **Environment Usage & Architecture** - Environment strategy and connectivity
- **CoE & Governance** - Center of Excellence structure and processes
- **Security & Compliance** - Security measures and compliance frameworks
- **Monitoring & Observability** - Platform monitoring and insights
- **ALM & Development** - Application Lifecycle Management practices
- **Training & Adoption** - User training and adoption strategies
- **Integration & Connectivity** - Integration patterns and connectivity
- **Performance & Scalability** - Performance optimization and scaling

## ✨ Features

- **Multi-Project Support** - Create and manage multiple assessment projects
- **RAG Status Indicators** - Red/Amber/Green status for quick risk assessment
- **Rich Question Types** - Boolean, scale, percentage, text, numeric, and document review
- **Evidence Tracking** - Document observations and evidence for each question
- **Risk Ownership** - Assign risk owners for identified issues
- **Export Capabilities** - Export to Excel, JSON, and Word documents
- **Best Practice Guidance** - Built-in recommendations and Microsoft links
- **Responsive Design** - Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Power-Platform-Assessment-Suite
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Radix UI + Tailwind CSS
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **Export**: ExcelJS, DOCX, FileSaver
- **PDF**: React-PDF for document review

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── assessment/         # Assessment pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard page
├── components/             # React components
│   ├── question-types/     # Question input components
│   ├── ui/                 # Reusable UI components
│   └── ...                 # Feature components
├── lib/                    # Utilities and constants
│   ├── constants.ts        # Assessment standards
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Helper functions
│   └── export.ts          # Export functionality
├── store/                  # State management
│   └── assessment-store.ts # Zustand store
└── hooks/                  # Custom React hooks
```

## 🔧 Configuration

### Assessment Standards

Assessment standards are defined in `lib/constants.ts`. Each standard includes:

- Questions with different types (boolean, scale, percentage, etc.)
- Weighting for scoring
- Best practice guidance
- Risk assessment criteria

### Customization

To customize the assessment:

1. Modify `lib/constants.ts` to add/remove standards or questions
2. Update `lib/types.ts` for new question types
3. Add corresponding input components in `components/question-types/`

## 📚 Governance Documentation

This repository includes comprehensive Power Platform governance documentation (January 2026) in the `/docs/governance/` directory:

### Strategic Documentation
- **[Environmental Strategy](docs/governance/Environmental_Strategy.md)** - Three-container architecture and implementation approach
- **[Implementation Workbook](docs/governance/Implementation_Workbook.md)** - 8-part actionable governance workbook
- **[Workshop Script](docs/governance/Workshop_Script.md)** - Interactive discovery workshop guide (~2.5 hours)

### Quick Reference Resources
- **[Quick Reference Card](docs/governance/Quick_Reference_Card.md)** - Single-page desk reference
- **[Glossary](docs/governance/Glossary.md)** - Comprehensive governance terminology
- **[Top Tips and Talking Points](docs/governance/Top_Tips_and_Talking_Points.md)** - Strategic guidance and quick wins

### Practical Guides
- **[Junior Developer Guide](docs/governance/Junior_Developer_Guide.md)** - Maker onboarding resource
- **[Justification and Citations](docs/governance/Justification_and_Citations.md)** - Evidence-based strategies with Microsoft citations

### Assessment Integration
The governance deliverables integrate with the assessment suite through TypeScript modules in `/lib/governance/integration/`:
- Governance Workbook assessment questions
- Environmental Strategy risk assessment questions
- PL-600 exam scenario questions

See the [Governance Documentation Index](docs/governance/README.md) for detailed navigation and recommended reading paths.

## 📊 Usage

1. **Create a Project** - Start by creating a new assessment project
2. **Complete Assessments** - Go through each standard and answer questions
3. **Add Evidence** - Document observations and evidence for each answer
4. **Review RAG Status** - Monitor Red/Amber/Green status indicators
5. **Export Results** - Generate reports in Excel, JSON, or Word format
6. **Reference Governance Docs** - Use the comprehensive governance guides for implementation guidance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the [Microsoft Power Platform documentation](https://learn.microsoft.com/en-us/power-platform/)
- Review the [CoE Starter Kit](https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit)

## 🔄 Changelog

### v0.1.0
- Initial release with 10 assessment standards
- Multi-project support
- Export functionality
- RAG status indicators
- Document review capabilities
