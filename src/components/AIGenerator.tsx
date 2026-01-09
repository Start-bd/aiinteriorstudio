import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, Coins, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { useStyles } from '@/hooks/useStyles';
import { useRoomTypes } from '@/hooks/useRoomTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIGeneratorProps {
  onImageGenerated?: (imageUrl: string, prompt: string) => void;
}

export function AIGenerator({ onImageGenerated }: AIGeneratorProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { credits, isUnlimited, hasEnoughCredits, refreshCredits } = useCredits();
  const { styles, loading: stylesLoading } = useStyles();
  const { roomTypes, loading: roomTypesLoading } = useRoomTypes();

  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!user) {
      navigate('/auth?redirect=/');
      return;
    }

    if (!hasEnoughCredits(1)) {
      toast.error('Not enough credits. Please upgrade or buy more credits.');
      navigate('/pricing');
      return;
    }

    if (!prompt.trim() && !selectedStyle && !selectedRoom) {
      toast.error('Please describe your design or select a style and room type');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Build the full prompt
      const styleName = styles.find(s => s.name === selectedStyle)?.display_name || '';
      const roomName = roomTypes.find(r => r.name === selectedRoom)?.display_name || '';
      
      let fullPrompt = prompt.trim();
      if (roomName) fullPrompt = `${roomName} - ${fullPrompt}`;
      if (styleName) fullPrompt = `${styleName} style ${fullPrompt}`;
      if (!fullPrompt) fullPrompt = `${styleName} style ${roomName} interior design`;

      const { data, error } = await supabase.functions.invoke('generate-interior-image', {
        body: { prompt: fullPrompt }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          toast.error('Rate limit exceeded. Please wait a moment before trying again.');
        } else if (error.message?.includes('credits')) {
          toast.error('Not enough credits. Please upgrade your plan.');
        } else {
          throw error;
        }
        return;
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        refreshCredits();
        toast.success('Design generated successfully!');
        onImageGenerated?.(data.imageUrl, fullPrompt);
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      const rawMessage =
        error?.context?.message || error?.message || 'Failed to generate design. Please try again.';

      // Make common backend errors more readable
      const message = rawMessage
        .replace(/\s+/g, ' ')
        .trim()
        .replace('Function returned an error', 'Server error');

      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const loading = stylesLoading || roomTypesLoading;

  return (
    <Card className="glass-card border-border p-6">
      <div className="space-y-6">
        {/* Header with Credits */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold">Create Your Design</h3>
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {isUnlimited ? '∞' : credits} {!isUnlimited && 'credits'}
            </span>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <Label>Style</Label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select a style..." />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style.name} value={style.name}>
                  <div className="flex flex-col">
                    <span>{style.display_name}</span>
                    {style.description && (
                      <span className="text-xs text-muted-foreground">{style.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Type Selection */}
        <div className="space-y-2">
          <Label>Room Type</Label>
          <Select value={selectedRoom} onValueChange={setSelectedRoom} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Select room type..." />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((room) => (
                <SelectItem key={room.name} value={room.name}>
                  {room.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Prompt */}
        <div className="space-y-2">
          <Label>Describe your vision (optional)</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cozy space with warm lighting, plants, and natural wood textures..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {prompt.length}/500
          </p>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !user || (!hasEnoughCredits(1) && !isUnlimited)}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating magic...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Design
            </>
          )}
        </Button>

        {!user && (
          <p className="text-center text-sm text-muted-foreground">
            <Button variant="link" onClick={() => navigate('/auth')} className="p-0 h-auto">
              Sign in
            </Button>{' '}
            to start generating designs
          </p>
        )}

        {/* Loading Skeleton */}
        {isGenerating && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <h4 className="font-medium">Generating your design...</h4>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
              <Skeleton className="w-full h-full" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  AI is crafting your perfect space...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generated Image Preview */}
        {generatedImage && !isGenerating && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <h4 className="font-medium">Generated Design</h4>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary animate-scale-in">
              <img
                src={generatedImage}
                alt="Generated interior design"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
