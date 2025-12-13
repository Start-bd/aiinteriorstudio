import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, User, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interior-design-chat`;
const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-interior-image`;

// Keywords that indicate the user wants an image
const IMAGE_KEYWORDS = [
  "generate", "create", "show me", "make", "design", "visualize", 
  "image", "picture", "photo", "render", "draw", "illustrate",
  "what would", "can you show", "let me see"
];

function detectImageRequest(text: string): boolean {
  const lowerText = text.toLowerCase();
  return IMAGE_KEYWORDS.some(keyword => lowerText.includes(keyword)) &&
    (lowerText.includes("room") || lowerText.includes("interior") || 
     lowerText.includes("space") || lowerText.includes("design") ||
     lowerText.includes("kitchen") || lowerText.includes("bedroom") ||
     lowerText.includes("living") || lowerText.includes("bathroom") ||
     lowerText.includes("office") || lowerText.includes("dining"));
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateImage = async (prompt: string): Promise<string | null> => {
    try {
      const resp = await fetch(IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await resp.json();
      return data.imageUrl || null;
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      return null;
    }
  };

  const streamChat = useCallback(async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages.map(m => ({ role: m.role, content: m.content })) }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isGeneratingImage) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const userInput = input.trim();
    setInput("");

    // Check if the user wants an image
    const wantsImage = detectImageRequest(userInput);

    if (wantsImage) {
      setIsGeneratingImage(true);
      
      // Add a placeholder message
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "✨ Creating your AI interior design visualization..." 
      }]);

      try {
        const imageUrl = await generateImage(userInput);
        
        if (imageUrl) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "Here's your AI-generated interior design concept! Would you like me to create variations or adjust the style?",
              imageUrl,
            };
            return updated;
          });
        } else {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "I wasn't able to generate an image this time. Could you try describing your vision with more details?",
            };
            return updated;
          });
        }
      } catch (error) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "I encountered an issue generating the image. Please try again with a different description.",
          };
          return updated;
        });
      } finally {
        setIsGeneratingImage(false);
      }
    } else {
      // Regular chat response
      setIsLoading(true);
      try {
        await streamChat(newMessages);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I apologize, but I encountered an issue. Please try again in a moment.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGenerateClick = () => {
    if (input.trim()) {
      const enhancedInput = input.toLowerCase().includes("generate") || input.toLowerCase().includes("create")
        ? input
        : `Generate an interior design of ${input}`;
      setInput(enhancedInput);
      setTimeout(() => handleSend(), 100);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center",
          "bg-gradient-gold shadow-gold hover:scale-110 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        )}
        aria-label={isOpen ? "Close chat" : "Open AI Design Assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)]",
          "rounded-2xl overflow-hidden shadow-elevated",
          "transform transition-all duration-300 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-card border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                AI Design Assistant
              </h3>
              <p className="text-xs text-muted-foreground">
                Chat & Generate Interior Designs
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[420px] overflow-y-auto bg-background p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display text-lg text-foreground mb-2">
                Welcome to AI Design
              </h4>
              <p className="text-sm text-muted-foreground max-w-[280px] mx-auto mb-4">
                Chat about design ideas or generate AI interior visualizations instantly.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Generate a modern living room",
                  "Cozy Scandinavian bedroom",
                  "Minimalist home office"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                  message.role === "user" ? "bg-primary" : "bg-secondary"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl overflow-hidden",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-secondary text-secondary-foreground rounded-tl-md"
                )}
              >
                {message.imageUrl && (
                  <div className="w-full">
                    <img
                      src={message.imageUrl}
                      alt="AI generated interior design"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap px-4 py-2.5">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-100" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}

          {isGeneratingImage && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Generating design...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your dream space..."
              disabled={isLoading || isGeneratingImage}
              className={cn(
                "flex-1 bg-secondary border-0 rounded-xl px-4 py-2.5 text-sm",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                "disabled:opacity-50"
              )}
            />
            <Button
              onClick={handleGenerateClick}
              disabled={!input.trim() || isLoading || isGeneratingImage}
              size="icon"
              variant="secondary"
              className="rounded-xl"
              title="Generate Image"
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isGeneratingImage}
              size="icon"
              className="rounded-xl bg-gradient-gold hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Tip: Click <Image className="w-3 h-3 inline" /> to generate an image
          </p>
        </div>
      </div>
    </>
  );
}
