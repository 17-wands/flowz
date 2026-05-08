import type { CommunityTemplate } from '../types'
import { aiNativeTemplate } from './ai-native'
import { llmApiProductTemplate } from './llm-api-product'
import { dataScienceTemplate } from './data-science'

export const TEMPLATES = [aiNativeTemplate, llmApiProductTemplate, dataScienceTemplate]

export const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    name: 'Anthropic Cookbook',
    description: 'Official Claude API recipes and patterns from Anthropic engineers.',
    source: 'GitHub',
    url: 'https://github.com/anthropics/anthropic-cookbook',
    tags: ['claude', 'api', 'patterns'],
  },
  {
    name: 'n8n Community Workflows',
    description: 'Thousands of automation workflows shared by the n8n community.',
    source: 'n8n.io',
    url: 'https://n8n.io/workflows',
    tags: ['automation', 'no-code', 'integrations'],
  },
  {
    name: 'LangChain Hub',
    description: 'Prompts and chains shared by the LangChain community.',
    source: 'Smith.langchain.com',
    url: 'https://smith.langchain.com/hub',
    tags: ['langchain', 'prompts', 'chains'],
  },
  {
    name: 'Anthropic Prompt Engineering Tutorial',
    description: 'Curated prompt patterns and techniques for working with Claude.',
    source: 'GitHub',
    url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial',
    tags: ['claude', 'prompts', 'tutorial'],
  },
]
