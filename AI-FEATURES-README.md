# LEEWAY™ AI-Enhanced Features

## Overview

The LEEWAY™ AI-Enhanced Features module adds intelligent capabilities to the Agent Lee CRM system, making it more productive and user-friendly. This module leverages AI to enhance four key areas:

1. **AI-Assisted To-Dos**: Smart task creation, prioritization, and reminders
2. **AI-Powered Timeline**: Event summarization and contextual linking
3. **AI-Generated Business Card**: Personalized content and auto-updates
4. **AI-Optimized Email Signature**: Content improvement and localization

## Key Features

### AI-Assisted To-Dos

- **Smart Task Extraction**: Automatically extracts actionable to-dos from voice dictation or text input
- **Intelligent Prioritization**: Suggests appropriate priority levels based on content analysis
- **Due Date Recognition**: Identifies and sets due dates from natural language references
- **Context Awareness**: Links to-dos with relevant contacts or companies mentioned in the text

### AI-Powered Timeline

- **Event Summarization**: Condenses lengthy notes into concise timeline entries
- **Smart Categorization**: Automatically categorizes events by type (meeting, call, email, etc.)
- **Key Information Extraction**: Identifies and highlights important details from event descriptions
- **Contextual Linking**: Connects timeline events to related records in the CRM

### AI-Generated Business Card

- **Audience-Specific Content**: Creates tailored business card content for different audiences
- **Dynamic Adaptation**: Adjusts messaging based on industry, role, or relationship
- **Highlight Selection**: Identifies and showcases the most relevant skills and offerings
- **Visual Styling Suggestions**: Recommends appropriate design elements for the target audience

### AI-Optimized Email Signature

- **Style Variation**: Generates signatures in different styles (professional, creative, minimal, etc.)
- **Content Optimization**: Suggests improvements for clarity and impact
- **Responsive Design**: Creates signatures that work well across different devices and email clients
- **Brand Consistency**: Maintains brand voice while allowing for personalization

## Files

- `leeway-ai-features.js`: Core implementation of AI-enhanced features
- `leeway-chunking.js`: Smart text chunking for handling large inputs
- `ai-features-test.html`: Test page to demonstrate AI feature capabilities

## Integration with LEEWAY™ Technologies

This module integrates with other LEEWAY™ technologies:

- **LeewayAI**: Used for generating and processing AI content
- **LeewayTech.Voice**: Used for voice dictation input
- **idb-keyval**: Used for storing and retrieving data in IndexedDB

## Usage

### To-Dos

```javascript
// Extract to-do from text
const todoData = await LeewayAIFeatures.extractTodoFromText("Follow up with Bay View Studio next Wednesday");

console.log(todoData);
// {
//   task: "Follow up with Bay View Studio",
//   priority: "Medium",
//   dueDate: "2023-05-31",
//   related: "Bay View Studio",
//   notes: ""
// }

// Load to-dos from IndexedDB
const todos = await LeewayAIFeatures.loadToDos();
```

### Voice Dictation for To-Dos

The module automatically sets up voice dictation for to-dos when initialized:

1. Click the voice button in the to-do form
2. Speak your to-do (e.g., "Call Milwaukee Music Store tomorrow about their order")
3. The AI will extract the task, priority, due date, and related information
4. Review and save the to-do

### Timeline Events

Timeline events are automatically enhanced with AI summarization:

1. When a new event is added to the timeline, the AI analyzes the content
2. It generates a concise title and summary
3. It identifies the event type and relevant entities
4. The enhanced event is displayed in the timeline with the extracted information

### Business Card Generation

```javascript
// Generate business card content for a specific audience
document.getElementById('generate-card-btn').addEventListener('click', async function() {
  const audience = document.getElementById('card-audience').value;
  
  // Use AI to generate tailored content
  const cardContent = await generateBusinessCardContent(audience);
  
  // Display or use the generated content
  displayBusinessCard(cardContent);
});
```

### Email Signature Generation

```javascript
// Generate email signature with a specific style
document.getElementById('generate-signature-btn').addEventListener('click', async function() {
  const style = document.getElementById('signature-style').value;
  
  // Use AI to generate styled signature
  const signatureContent = await generateEmailSignature(style);
  
  // Display or use the generated signature
  displayEmailSignature(signatureContent);
});
```

## Smart Chunking Integration

For handling large inputs, the AI features module integrates with the LEEWAY™ Smart Chunking System:

```javascript
// Process a large text input with chunking
const longText = "...very long text...";

// The AI system will automatically use chunking for large inputs
const result = await LeewayAI.generateText(longText);

// You can also specify chunking options
const result = await LeewayAI.generateText(longText, {
  chunkThreshold: 3000, // Use chunking for inputs longer than 3000 chars
  maxChunkSize: 1500,   // Max chars per chunk
  chunkInstructions: 'Summarize this section.' // Instructions for each chunk
});
```

## Testing

You can test the AI features using the `ai-features-test.html` file. This provides a UI to:

- Test to-do extraction from text
- Test timeline event summarization
- Test business card generation for different audiences
- Test email signature generation in different styles

## Performance Considerations

- AI processing may take a few seconds, especially for longer inputs
- The module uses caching to improve performance for repeated operations
- For offline use, the module falls back to basic functionality when AI is unavailable

## Browser Compatibility

The AI features module is compatible with all modern browsers that support:
- IndexedDB
- Web Speech API (for voice dictation)
- ES6 features
- Fetch API

## Security and Privacy

- All AI processing is done through secure API calls
- No user data is stored outside the local IndexedDB
- API keys are managed securely through the LEEWAY™ API Keys system

## Future Enhancements

- **Improved Natural Language Understanding**: Better extraction of complex tasks and relationships
- **Personalization**: Learning from user preferences and behavior to improve suggestions
- **Multilingual Support**: Processing inputs and generating outputs in multiple languages
- **Offline AI Processing**: Using WebLLM for fully offline AI capabilities

## Troubleshooting

### Common Issues

1. **AI Features Not Working**:
   - Check that the AI provider is properly initialized
   - Verify API keys are correctly configured
   - Check browser console for errors

2. **Voice Dictation Issues**:
   - Ensure microphone permissions are granted
   - Check that the browser supports Web Speech API
   - Try speaking more clearly and slowly

3. **Slow Performance**:
   - Large inputs may take longer to process
   - Consider using smaller chunks of text
   - Check network connection quality

### Getting Help

For additional assistance, refer to the LEEWAY™ documentation or contact support.
