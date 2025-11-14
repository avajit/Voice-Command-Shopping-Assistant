import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mic, MicOff, Languages, AlertCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { ShoppingItem } from '../App';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { searchProducts } from '../utils/productSearch';

interface VoiceCommandsProps {
  onAddItem: (name: string, quantity?: number, category?: string, price?: number) => void;
  onRemoveItem: (name: string) => void;
  onClearAll: () => void;
  items: ShoppingItem[];
  language: string;
  onLanguageChange: (language: string) => void;
  onListeningChange: (listening: boolean) => void;
}

export function VoiceCommands({
  onAddItem,
  onRemoveItem,
  onClearAll,
  items,
  language,
  onLanguageChange,
  onListeningChange,
}: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isHttps, setIsHttps] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Check HTTPS on mount
  useEffect(() => {
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    setIsHttps(isSecure);
    if (!isSecure) {
      toast.error('Voice features require HTTPS. Please use a secure connection or localhost.');
    }
  }, []);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ja-JP', name: 'Japanese' },
  ];

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast.error('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      
      if (event.results[current].isFinal) {
        setTranscript(transcriptText);
        processCommand(transcriptText);
      } else {
        setTranscript(transcriptText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        toast.error('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please enable microphone permissions.');
        setPermissionDenied(true);
      } else {
        toast.error(`Voice recognition error: ${event.error}`);
      }
      setIsListening(false);
      onListeningChange(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();

    // Add item commands - more flexible patterns
    const addPatterns = [
      /add (\d+)?\s*(.+?)(?:\s+to (?:my )?list)?$/i,
      /i (?:need|want) (?:to buy )?(\d+)?\s*(.+)$/i,
      /buy (\d+)?\s*(.+)$/i,
      /get (\d+)?\s*(.+)$/i,
      /purchase (\d+)?\s*(.+)$/i,
      // More flexible patterns for natural speech
      /(?:please )?add (.+)$/i,
      /(?:i want|i need|i\'d like) (.+)$/i,
      /(?:can you add|could you add) (.+)$/i,
      /(?:put|include) (.+?)(?:\s+on (?:my )?list)?$/i,
      // Direct item names - if command is just an item name, add it
      /^([a-zA-Z\s]+)$/i,
    ];

    for (const pattern of addPatterns) {
      const match = lowerCommand.match(pattern);
      if (match) {
        let quantity = 1;
        let itemName = '';

        if (match[1] && match[2]) {
          // Pattern with quantity and item
          quantity = match[1] ? parseInt(match[1]) : 1;
          itemName = match[2].trim();
        } else if (match[1]) {
          // Single match - could be quantity or item
          if (!isNaN(parseInt(match[1]))) {
            quantity = parseInt(match[1]);
            itemName = match[2] ? match[2].trim() : '';
          } else {
            itemName = match[1].trim();
          }
        }

        // Extract quantity from item name if present
        const quantityMatch = itemName.match(/^(\d+)\s+(.+)$/);
        if (quantityMatch) {
          quantity = parseInt(quantityMatch[1]);
          itemName = quantityMatch[2].trim();
        }

        if (itemName) {
          // Extract price from command if mentioned
          let extractedPrice: number | undefined;
          const pricePatterns = [
            /for (\d+(?:\.\d{2})?)\s*dollars?/i,
            /\$(\d+(?:\.\d{2})?)/i,
            /(\d+(?:\.\d{2})?)\s*dollars?/i,
            /costs? (\d+(?:\.\d{2})?)/i,
          ];

          for (const pricePattern of pricePatterns) {
            const priceMatch = lowerCommand.match(pricePattern);
            if (priceMatch) {
              extractedPrice = parseFloat(priceMatch[1]);
              // Remove price from item name
              itemName = itemName.replace(new RegExp(priceMatch[0], 'gi'), '').trim();
              break;
            }
          }

          // Clean up common words
          itemName = itemName
            .replace(/\b(a|an|the|some|few|many|couple of|dozen|pack of|bottle of|can of|box of|bag of|loaf of|pound of|pounds of|ounces of|oz of|for|costs?|dollars?)\b/gi, '')
            .trim();

          if (itemName) {
            // Search for the product in API and add with real price
            searchProducts(itemName).then(results => {
              if (results.length > 0) {
                const bestMatch = results[0];
                const priceToUse = extractedPrice || bestMatch.price;
                onAddItem(bestMatch.name, quantity, bestMatch.category, priceToUse);
                toast.success(`Added ${bestMatch.name} for $${priceToUse}`);
              } else {
                // Item not available in API
                toast.error(`${itemName} is not available in the store.`);
              }
            }).catch(() => {
              // API failed
              toast.error(`${itemName} is not available in the store.`);
            });
            setTranscript('');
            return;
          }
        }
      }
    }

    // Remove item commands
    const removePatterns = [
      /remove (.+?)(?:\s+from (?:my )?list)?$/i,
      /delete (.+?)(?:\s+from (?:my )?list)?$/i,
      /take (?:off |out )?(.+?)(?:\s+from (?:my )?list)?$/i,
      /(?:please )?remove (.+)$/i,
      /(?:can you remove|could you remove) (.+)$/i,
      /(?:take out|take off) (.+)$/i,
    ];

    for (const pattern of removePatterns) {
      const match = lowerCommand.match(pattern);
      if (match) {
        let itemName = match[1].trim();
        // Clean up common words
        itemName = itemName
          .replace(/\b(from my list|from the list|from list)\b/gi, '')
          .trim();
        onRemoveItem(itemName);
        setTranscript('');
        return;
      }
    }

    // Clear all commands
    if (lowerCommand.includes('clear all') ||
        lowerCommand.includes('delete all') ||
        lowerCommand.includes('remove all') ||
        lowerCommand.includes('empty list') ||
        lowerCommand.includes('clear list') ||
        lowerCommand.includes('delete everything')) {
      onClearAll();
      setTranscript('');
      return;
    }

    // If no pattern matched, try to extract any item-like words
    const words = lowerCommand.split(/\s+/);
    const potentialItems = words.filter(word =>
      word.length > 2 &&
      !['add', 'get', 'buy', 'need', 'want', 'please', 'can', 'could', 'you', 'the', 'a', 'an', 'some', 'and', 'or', 'but', 'to', 'from', 'my', 'list'].includes(word.toLowerCase())
    );

    if (potentialItems.length > 0) {
      const itemName = potentialItems.join(' ');
      // Search for the product in API and add with real price
      searchProducts(itemName).then(results => {
        if (results.length > 0) {
          const bestMatch = results[0];
          onAddItem(bestMatch.name, 1, bestMatch.category, bestMatch.price);
          toast.success(`Added ${bestMatch.name} for $${bestMatch.price}`);
        } else {
          // Item not available in API
          toast.error(`${itemName} is not available in the store.`);
        }
      }).catch(() => {
        // API failed
        toast.error(`${itemName} is not available in the store.`);
      });
      setTranscript('');
      return;
    }

    // If still no match
    toast.error('Command not recognized. Try saying just the item name like "potato" or "milk"');
    setTranscript('');
  };

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      onListeningChange(false);
      setTranscript('');
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      onListeningChange(true);
      toast.success('Listening for voice commands...');
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-600" />
          Voice Commands
        </CardTitle>
        <CardDescription>
          Use your voice to manage your shopping list
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Denied Alert */}
        {permissionDenied && (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Microphone Access Denied</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>To use voice commands, please enable microphone permissions:</p>
              <ol className="list-decimal ml-4 text-sm space-y-1 mt-2">
                <li>Click the <strong>🔒 lock icon</strong> or <strong>camera icon</strong> in your browser's address bar</li>
                <li>Find "Microphone" in the permissions list</li>
                <li>Change it to <strong>"Allow"</strong></li>
                <li>Refresh this page</li>
              </ol>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  setPermissionDenied(false);
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* HTTPS Warning */}
        {!isHttps && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>HTTPS Required</AlertTitle>
            <AlertDescription>
              Voice recognition requires a secure HTTPS connection. Please access this app via HTTPS or localhost.
            </AlertDescription>
          </Alert>
        )}

        {/* Browser Not Supported */}
        {!isSupported && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Browser Not Supported</AlertTitle>
            <AlertDescription>
              Voice recognition is not available in this browser. Please use Google Chrome or Microsoft Edge for the best experience.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={toggleListening}
            className={`flex-1 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={!isSupported || !isHttps}
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Listening
              </>
            )}
          </Button>

          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isListening && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-2">Listening...</p>
            <p className="text-gray-900 min-h-[24px]">
              {transcript || <span className="text-gray-400">Speak a command...</span>}
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-700">Example commands:</p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• "Add iPhone 15"</li>
            <li>• "I need Nike Air Max"</li>
            <li>• "Buy Dyson vacuum"</li>
            <li>• "Remove bread from my list"</li>
            <li>• "Clear all"</li>
            <li>• "MacBook Pro for $3499"</li>
            <li>• "organic bananas costs 0.59"</li>
            <li>• "Atomic Habits $16.99"</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            💡 Available items: iPhone, MacBook Pro, Nike shoes, Dyson vacuum, Atomic Habits, organic bananas, whole milk, eggs, bread, etc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}