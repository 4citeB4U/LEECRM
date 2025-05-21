# LEEWAY™ Smart Chunking System

## Overview

The LEEWAY™ Smart Chunking System is a robust solution for handling large inputs that need to be processed in smaller pieces. This is particularly useful for AI processing where models have context window limitations.

## Key Features

- **Intelligent Text Splitting**: Breaks down large texts into semantically meaningful chunks based on sentence boundaries
- **Token Estimation**: Provides approximate token count estimation for text inputs
- **Fallback Mechanisms**: Handles edge cases like extremely long sentences with word and character-level splitting
- **Progress Tracking**: Emits events to track processing progress
- **Flexible Integration**: Works seamlessly with different AI providers

## Files

- `leeway-chunking.js`: Core chunking functionality and AgenticController class
- `chunking-test.html`: Test page to demonstrate chunking capabilities

## Usage

### Basic Chunking

```javascript
// Import the chunking module
// (Already available as window.LeewayChunking in the LEEWAY™ system)

// Split text into chunks
const text = "Your long text input here...";
const chunks = LeewayChunking.splitTextToChunks(text, 1000); // Max 1000 chars per chunk

// Process each chunk
for (const chunk of chunks) {
  console.log(`Processing chunk: ${chunk.substring(0, 50)}...`);
  // Process the chunk...
}
```

### Token-Based Chunking

```javascript
// Split text based on estimated token count
const text = "Your long text input here...";
const maxTokens = 250; // Max tokens per chunk
const chunks = LeewayChunking.splitTextToTokenChunks(text, maxTokens);

// Estimate tokens in a text
const tokenCount = LeewayChunking.estimateTokenCount(text);
console.log(`Estimated token count: ${tokenCount}`);
```

### Using the AgenticController

```javascript
// Create a controller
const controller = new LeewayChunking.AgenticController({
  maxChunkSize: 2000, // Max chars per chunk
  aiProvider: window.LeewayAI // Optional AI provider
});

// Process text with a custom function
const result = await controller.execute(longText, async (chunk, index) => {
  console.log(`Processing chunk ${index + 1}`);
  // Process the chunk and return a result
  return `Result for chunk ${index + 1}: ${chunk.substring(0, 20)}...`;
});

// The result will be the aggregated results from all chunks
console.log(result);
```

### Tracking Progress

```javascript
// Listen for progress events
document.addEventListener('leeway-chunking-progress', function(event) {
  const { current, total, percentage } = event.detail;
  console.log(`Processing: ${percentage}% (${current}/${total})`);
  
  // Update UI with progress
  progressBar.style.width = `${percentage}%`;
});
```

## Integration with LEEWAY™ AI

The chunking system is automatically integrated with the LEEWAY™ AI system. When a prompt exceeds the threshold (default: 4000 characters), the system will automatically use chunking to process it.

```javascript
// This will automatically use chunking for large inputs
const result = await LeewayAI.generateText(veryLongPrompt);

// You can also specify chunking options
const result = await LeewayAI.generateText(veryLongPrompt, {
  chunkThreshold: 3000, // Use chunking for prompts longer than 3000 chars
  maxChunkSize: 1500, // Max chars per chunk
  chunkInstructions: 'Summarize this section of text.' // Instructions for each chunk
});
```

## How It Works

1. **Text Analysis**: The system analyzes the input text to identify natural boundaries (sentences, paragraphs)
2. **Chunking**: The text is split into chunks that respect these boundaries while staying under the size limit
3. **Processing**: Each chunk is processed individually
4. **Aggregation**: The results from all chunks are combined into a final output

## Edge Cases

- **Long Sentences**: If a sentence exceeds the maximum chunk size, it will be split by words
- **Long Words**: If a word exceeds the maximum chunk size, it will be split by characters
- **Instructions Preservation**: When used with AI prompts, the system attempts to preserve instructions at the beginning of the prompt

## Testing

You can test the chunking functionality using the `chunking-test.html` file. This provides a UI to:

- Input text and see how it's split into chunks
- Adjust chunking parameters
- Process chunks with AI
- Track processing progress

## Performance Considerations

- Chunking adds some overhead but enables processing of inputs that would otherwise be too large
- The default chunk size (2000 characters) is optimized for most use cases
- For very large inputs (100K+ characters), consider increasing the chunk size to reduce the number of chunks

## Browser Compatibility

The chunking system is compatible with all modern browsers that support:
- ES6 features
- Promises
- Custom Events

## Future Enhancements

- Improved token counting for different models
- More sophisticated chunking strategies based on semantic meaning
- Parallel processing of chunks where appropriate
- Contextual awareness between chunks
