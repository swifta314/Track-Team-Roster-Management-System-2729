// Quest Labs SDK Configuration
export default {
  apiKey: import.meta.env.VITE_QUEST_API_KEY || 'demo-key',
  entityId: import.meta.env.VITE_QUEST_ENTITY_ID || 'demo-entity',
  apiType: import.meta.env.VITE_QUEST_API_TYPE || 'STAGING',
  userId: 'demo-user'
};