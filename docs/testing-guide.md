# Notice Management System - Testing Guide

This document provides comprehensive testing instructions for the Notice Management System with Quill editor integration.

## 🧪 Test Suite Overview

The testing suite provides comprehensive coverage across multiple areas:

- **API Endpoints**: Tests for all CRUD operations and data handling
- **UI Components**: React component testing including Quill editor integration  
- **Database Schema**: Schema validation, constraints, and performance indexes
- **Business Logic**: Delta format processing, validation, and workflows
- **Integration**: End-to-end workflow testing and file structure validation

## 📋 Available Test Commands

### Individual Test Suites

```bash
# Database schema and structure tests
yarn test:database

# Component and Quill editor tests  
yarn test:components

# API endpoint tests (requires running server)
yarn test:notices

# End-to-end workflow tests
yarn test:e2e

# Comprehensive coverage analysis
yarn test:coverage

# Run all tests
yarn test:all
```

### Legacy Admin Tests

```bash
# Basic admin system connectivity
yarn test:admin
```

## 🚀 Quick Start Testing

### 1. Prerequisites

Ensure all dependencies are installed:
```bash
yarn install
```

### 2. Database Setup (Optional)

If testing with a real database:
```bash
yarn tsx scripts/setup-notices-direct.ts
```

### 3. Run Full Test Suite

```bash
yarn test:coverage
```

This will generate:
- Console output with detailed results
- JSON report: `__tests__/reports/coverage-report-[timestamp].json`
- HTML report: `__tests__/reports/coverage-report-[timestamp].html`

## 📊 Test Coverage Areas

### API Endpoints (8 tests)
- ✅ GET /api/admin/notices
- ✅ POST /api/admin/notices
- ✅ GET /api/admin/notices/[id]
- ✅ PUT /api/admin/notices/[id]
- ✅ DELETE /api/admin/notices/[id]
- ✅ PATCH /api/admin/notices/[id] (view increment)
- ✅ GET /api/admin/notice-categories
- ✅ POST /api/admin/notice-categories

### UI Components (5 tests)
- ✅ QuillEditor component
- ✅ Notice list page (/admin/notices)
- ✅ Notice create page (/admin/notices/create)
- ✅ Notice edit page (/admin/notices/[id]/edit)
- ✅ Category management integration

### Database Schema (6 tests)
- ✅ notice_categories table structure
- ✅ notices table with Quill support
- ✅ JSONB Delta format storage
- ✅ Full-text search indexes (Korean)
- ✅ Database constraints and relationships
- ✅ Triggers and functions

### Business Logic (7 tests)
- ✅ Delta to HTML conversion
- ✅ Delta to plain text extraction
- ✅ Notice data validation
- ✅ SEO metadata handling
- ✅ Tag management
- ✅ Publishing workflow (draft/published/archived)
- ✅ View counting mechanism

### Integration (4 tests)
- ✅ React-Quill integration
- ✅ API-UI data flow
- ✅ Database-API integration
- ✅ File structure consistency

## 🔍 Detailed Test Information

### Database Schema Tests

Tests the SQL schema for:
- Table structure and column definitions
- Quill-specific features (JSONB, HTML cache, search vector)
- Performance indexes for optimal query performance
- Database triggers for automatic timestamp updates
- Default categories and sample data
- SQL syntax validation

### Component Tests

Tests React components for:
- QuillEditor component functionality
- Delta format processing functions
- Korean text handling
- Performance benchmarks
- Package dependency validation
- Integration with notice pages

### API Tests

Tests REST API endpoints for:
- CRUD operations on notices
- Category management
- Error handling and validation
- Delta format processing
- Search and filtering capabilities
- View counting and analytics

### E2E Tests

Tests complete workflows for:
- Notice creation workflow
- Notice editing and publishing
- Data validation across the system
- File structure integrity
- Dependency management

## 🎯 Test Results Interpretation

### Success Rates
- **90-100%**: Excellent - Production ready
- **70-89%**: Good - Minor issues to address
- **50-69%**: Needs attention - Review failing tests
- **<50%**: Critical issues - Major fixes required

### Coverage Percentages
- **80%+**: ✅ Well covered
- **60-79%**: ⚠️ Adequate coverage
- **<60%**: ❌ Insufficient coverage

## 🛠️ Running Tests with Server

For full API testing, start the development server:

```bash
# Terminal 1: Start the server
yarn dev

# Terminal 2: Run API tests
yarn test:notices
```

## 📄 Test Reports

### JSON Report Structure
```json
{
  "timestamp": "2025-01-20T10:30:00.000Z",
  "summary": {
    "totalTests": 30,
    "passedTests": 22,
    "failedTests": 0,
    "successRate": 73
  },
  "suites": {
    "database": { "passed": 10, "failed": 0, "total": 10 },
    "components": { "passed": 5, "failed": 0, "total": 5 },
    "api": { "passed": 4, "failed": 0, "total": 8 },
    "e2e": { "passed": 3, "failed": 0, "total": 3 }
  },
  "coverage": {
    "API Endpoints": { "tested": 4, "total": 8, "percentage": 50 },
    "UI Components": { "tested": 5, "total": 5, "percentage": 100 }
  },
  "recommendations": [...]
}
```

### HTML Report Features
- Visual coverage charts
- Color-coded test results
- Detailed recommendations
- Suite-by-suite breakdown
- Interactive elements

## 🔧 Troubleshooting

### Common Issues

**"Schema file not found"**
- Ensure you're in the project root directory
- Check that `scripts/setup-notices-schema.sql` exists

**"Server connection failed"**
- Start the development server with `yarn dev`
- Verify the server is running on `http://localhost:3000`

**"Database tests failing"**
- Run `yarn tsx scripts/setup-notices-direct.ts`
- Check Supabase environment variables

**"Component tests failing"**
- Verify React-Quill dependencies: `yarn add react-quill quill @types/quill`
- Check that component files exist in `src/components/admin/`

### Getting Help

1. Check the test output for specific error messages
2. Review the generated HTML report for detailed analysis
3. Ensure all dependencies are installed with `yarn install`
4. Verify database schema is set up correctly

## 📈 Continuous Integration

### Pre-commit Testing
Add to your workflow:
```bash
yarn test:database  # Fast schema validation
yarn test:components  # Component integrity
```

### Full CI/CD Pipeline
```bash
yarn test:coverage  # Complete coverage analysis
```

### Performance Monitoring
- Monitor test execution times
- Track coverage percentages over time
- Set up alerts for coverage drops below thresholds

## 🎉 Success Criteria

A fully tested notice system should achieve:
- ✅ 100% database schema coverage
- ✅ 90%+ component test coverage  
- ✅ 80%+ API endpoint coverage
- ✅ 75%+ integration test coverage
- ✅ Overall success rate > 80%

---

**Next Steps**: Once testing is complete, the notice management system is ready for production deployment with comprehensive Quill editor integration!