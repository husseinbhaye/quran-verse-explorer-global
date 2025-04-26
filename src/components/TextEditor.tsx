
import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Bold, Italic, Underline } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextEditorProps {
  displayLanguage: 'english' | 'french';
}

const TextEditor = ({ displayLanguage }: TextEditorProps) => {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const handleFormat = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);
  };

  const handleSave = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: displayLanguage === 'english' ? 'Note saved' : 'Note enregistrée',
        description: displayLanguage === 'english' 
          ? 'Your note has been saved to your computer' 
          : 'Votre note a été enregistrée sur votre ordinateur',
      });
    } catch (error) {
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english'
          ? 'Failed to save note'
          : 'Échec de l\'enregistrement de la note',
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {displayLanguage === 'english' ? 'Text Editor' : 'Éditeur de texte'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {displayLanguage === 'english' ? 'Text Editor' : 'Éditeur de texte'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleFormat('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleFormat('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleFormat('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px] font-mono"
          placeholder={displayLanguage === 'english' ? 'Start writing...' : 'Commencez à écrire...'}
        />
        
        <Button onClick={handleSave} className="mt-4">
          {displayLanguage === 'english' ? 'Save to Computer' : 'Enregistrer'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TextEditor;
