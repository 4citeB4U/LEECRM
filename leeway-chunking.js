/**
 * LEEWAY™ Text Chunking Utility
 * 
 * This file implements text chunking functionality for handling large inputs
 * that need to be processed in smaller pieces for AI processing.
 */

// Create namespace
window.LeewayChunking = (function() {
  /**
   * Split text into chunks based on sentences or paragraphs
   * @param {string} text - Text to split into chunks
   * @param {number} maxSize - Maximum size of each chunk in characters
   * @returns {Array<string>} - Array of text chunks
   */
  function splitTextToChunks(text, maxSize = 1000) {
    // Split text into sentences using regex
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const chunks = [];
    let currentChunk = "";
    
    for (const sentence of sentences) {
      // If adding this sentence doesn't exceed max size, add it to current chunk
      if ((currentChunk.length + sentence.length + 1) <= maxSize) {
        currentChunk += currentChunk ? " " + sentence : sentence;
      } else {
        // Current chunk is full, push it and start a new chunk
        chunks.push(currentChunk);
        currentChunk = sentence;
        
        // Handle case where a single sentence is longer than maxSize
        if (sentence.length > maxSize) {
          console.warn("Found sentence longer than max chunk size. Splitting by characters.");
          
          // Split the long sentence into smaller chunks
          const sentenceChunks = splitLongSentence(sentence, maxSize);
          
          // Add all but the last chunk to chunks array
          chunks.pop(); // Remove the long sentence from chunks
          chunks.push(...sentenceChunks.slice(0, -1));
          
          // Set current chunk to the last sentence chunk
          currentChunk = sentenceChunks[sentenceChunks.length - 1];
        }
      }
    }
    
    // Add the last chunk if it's not empty
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }
  
  /**
   * Split a long sentence into smaller chunks
   * @param {string} sentence - Sentence to split
   * @param {number} maxSize - Maximum size of each chunk
   * @returns {Array<string>} - Array of sentence chunks
   */
  function splitLongSentence(sentence, maxSize) {
    const chunks = [];
    
    // Split by words first
    const words = sentence.split(/\s+/);
    
    let currentChunk = "";
    
    for (const word of words) {
      if ((currentChunk.length + word.length + 1) <= maxSize) {
        currentChunk += currentChunk ? " " + word : word;
      } else {
        // If current chunk plus word exceeds max size
        chunks.push(currentChunk);
        currentChunk = word;
        
        // If a single word is longer than maxSize, split by characters
        if (word.length > maxSize) {
          const wordChunks = [];
          
          for (let i = 0; i < word.length; i += maxSize) {
            wordChunks.push(word.substring(i, i + maxSize));
          }
          
          chunks.pop(); // Remove the current chunk
          chunks.push(...wordChunks.slice(0, -1)); // Add all but last word chunk
          currentChunk = wordChunks[wordChunks.length - 1]; // Set current chunk to last word chunk
        }
      }
    }
    
    // Add the last chunk if it's not empty
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }
  
  /**
   * Estimate token count for a text string
   * This is a rough approximation - about 4 chars per token for English text
   * @param {string} text - Text to estimate token count for
   * @returns {number} - Estimated token count
   */
  function estimateTokenCount(text) {
    // Simple approximation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }
  
  /**
   * Split text into chunks based on estimated token count
   * @param {string} text - Text to split into chunks
   * @param {number} maxTokens - Maximum tokens per chunk
   * @returns {Array<string>} - Array of text chunks
   */
  function splitTextToTokenChunks(text, maxTokens = 250) {
    // Convert maxTokens to approximate character count
    const maxChars = maxTokens * 4;
    
    // Use character-based chunking as an approximation
    return splitTextToChunks(text, maxChars);
  }
  
  /**
   * AgenticController class for managing chunking and processing
   */
  class AgenticController {
    /**
     * Create a new AgenticController
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
      this.memory = {
        chunkingStrategy: options.chunkingStrategy || this.defaultChunking,
        maxChunkSize: options.maxChunkSize || 1000,
        taskPlan: null,
        processedChunks: [],
        results: []
      };
      
      // Set AI provider
      this.aiProvider = options.aiProvider || window.LeewayAI;
      
      if (!this.aiProvider) {
        console.warn('No AI provider specified. Processing will be limited.');
      }
    }
    
    /**
     * Default chunking strategy
     * @param {string} text - Text to chunk
     * @param {number} maxSize - Maximum chunk size
     * @returns {Array<string>} - Array of chunks
     */
    defaultChunking(text, maxSize) {
      return splitTextToChunks(text, maxSize);
    }
    
    /**
     * Preprocess input text into chunks
     * @param {string} inputText - Input text to process
     * @returns {Array<string>} - Array of text chunks
     */
    preprocessInput(inputText) {
      if (inputText.length <= this.memory.maxChunkSize) {
        return [inputText];
      }
      return this.memory.chunkingStrategy(inputText, this.memory.maxChunkSize);
    }
    
    /**
     * Plan tasks for processing chunks
     * @param {Array<string>} chunks - Array of text chunks
     */
    planTasks(chunks) {
      this.memory.taskPlan = chunks.map((_, i) => `Process chunk ${i + 1}`);
    }
    
    /**
     * Execute processing on input text
     * @param {string} inputText - Input text to process
     * @param {Function} processingFunction - Function to process each chunk
     * @returns {Promise<string>} - Aggregated results
     */
    async execute(inputText, processingFunction) {
      // Reset memory for new execution
      this.memory.processedChunks = [];
      this.memory.results = [];
      
      // Preprocess input into chunks
      const chunks = this.preprocessInput(inputText);
      
      // Plan tasks
      this.planTasks(chunks);
      
      // Log chunk information for debugging
      console.log(`Total chunks: ${chunks.length}`);
      chunks.forEach((chunk, i) => {
        console.log(`Chunk ${i + 1} size: ${chunk.length} chars, ~${estimateTokenCount(chunk)} tokens`);
      });
      
      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // Defensive check to ensure chunk is not too large
        if (chunk.length > this.memory.maxChunkSize) {
          throw new Error(`Chunk ${i + 1} too large for processing: ${chunk.length} chars`);
        }
        
        // Process the chunk
        let result;
        if (processingFunction) {
          result = await processingFunction(chunk, i);
        } else if (this.aiProvider) {
          // Default to using AI provider if no processing function provided
          result = await this.aiProvider.generateText(chunk);
        } else {
          result = `[No processing function or AI provider for chunk ${i + 1}]`;
        }
        
        // Store processed chunk and result
        this.memory.processedChunks.push(chunk);
        this.memory.results.push(result);
        
        // Emit progress event
        this.emitProgress(i + 1, chunks.length);
      }
      
      // Return aggregated results
      return this.aggregateResults();
    }
    
    /**
     * Aggregate results from all chunks
     * @returns {string} - Aggregated results
     */
    aggregateResults() {
      return this.memory.results.join("\n");
    }
    
    /**
     * Emit progress event
     * @param {number} current - Current chunk number
     * @param {number} total - Total number of chunks
     */
    emitProgress(current, total) {
      const progressEvent = new CustomEvent('leeway-chunking-progress', {
        detail: {
          current,
          total,
          percentage: Math.round((current / total) * 100)
        }
      });
      
      document.dispatchEvent(progressEvent);
    }
  }
  
  // Return public API
  return {
    splitTextToChunks,
    splitTextToTokenChunks,
    estimateTokenCount,
    AgenticController
  };
})();
